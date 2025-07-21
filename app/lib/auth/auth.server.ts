import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { sessionStorage } from "~/lib/auth/session.server";
import { envs } from "../env";

interface User {
  isAuthenticated: boolean;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const password = form.get("password");

    if (password !== envs.ADMIN_PASSWORD) {
      console.log("Invalid password");
      throw new AuthorizationError("Invalid password");
    }

    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method
    return { isAuthenticated: true };
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "admin-password",
);
