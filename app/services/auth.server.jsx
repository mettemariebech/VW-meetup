// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";

export let authenticator = new Authenticator(sessionStorage, {
  sessionErrorKey: "sessionErrorKey", // keep in sync
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let mail = form.get("mail");
    let password = form.get("password");
    let user = null;

    if (!mail || mail?.length === 0) {
      throw new AuthorizationError("Bad Credentials: Email is required");
    }
    if (typeof mail !== "string") {
      throw new AuthorizationError("Bad Credentials: Email must be a string");
    }

    if (!password || password?.length === 0) {
      throw new AuthorizationError("Bad Credentials: Password is required");
    }
    if (typeof password !== "string") {
      throw new AuthorizationError(
        "Bad Credentials: Password must be a string",
      );
    }

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
