import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData } from "react-router";
import { SEOHandle } from "@nasa-gcn/remix-seo";

import { authenticator } from "~/lib/auth/auth.server";
import { commitSession, getSession } from "~/lib/auth/session.server";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Small } from "~/components/ui/typography";

// Do not generate sitemap entries for this route
export const handle: SEOHandle = {
  getSitemapEntries: () => null,
};

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("redirect");

  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("admin-password", request, {
    successRedirect: redirectUrl ?? "/",
    failureRedirect: "/login",
  });
}

interface LoaderData {
  error: { message: string } | null;
}

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to / directly
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSession(request.headers.get("cookie"));

  const error = session.get(
    authenticator.sessionErrorKey,
  ) as LoaderData["error"];

  return {
    error,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

const Login = () => {
  const { error } = useLoaderData<LoaderData>();

  return (
    <Form method="post" className="grid items-center gap-1.5">
      <Label htmlFor="password">Password</Label>
      <Input
        autoFocus
        type="password"
        id="password"
        name="password"
        placeholder="SuperSecretPassword"
      />
      {error != null && <Small className="text-red-500">{error.message}</Small>}
      <Button type="submit">Sign in</Button>
    </Form>
  );
};

export default Login;
