import "@fontsource-variable/inter/wght.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "react-router";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { Toaster } from "sonner";

import { Nav } from "./components/Nav";

import appStylesHref from "./globals.css?url";
import proseMirrorStylesHref from "./prosemirror.css?url";
import { authenticator } from "./lib/auth/auth.server";
import { getCategories } from "./lib/pocketbase/.server/categories";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
  { rel: "stylesheet", href: proseMirrorStylesHref },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isAuthenticated = await authenticator.isAuthenticated(request);

  const categories = await getCategories();

  return { isAuthenticated: isAuthenticated != null, categories };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          defer
          data-domain="farazpatankar.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>
        <div className="max-w-2xl mx-auto my-6 px-6 lg:px-0">
          <Nav
            isAuthenticated={data?.isAuthenticated ?? false}
            categories={data?.categories ?? []}
          />
          <section className="my-12">{children}</section>
        </div>
        <Toaster />

        {/* Remix */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
