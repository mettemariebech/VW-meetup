// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let mail = form.get("mail");
    let password = form.get("password");
    let user = null;

    // login the user, this could be whatever process you want
    if (mail === "test@mm.dk" && password === "test123") {
      user = {
        mail,
      };

      return user;
    } else {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError("Bad Credentials");
    }
  }),

  "user-pass",
);
