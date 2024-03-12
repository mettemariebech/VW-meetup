// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export let authenticator = new Authenticator(sessionStorage, {
  sessionErrorKey: "sessionErrorKey", // keep in sync
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    if (!email || email?.length === 0) {
      throw new AuthorizationError("Bad Credentials: Email is required");
    }
    if (typeof email !== "string") {
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

    const user = await verifyUser({ email, password });
    if (!user) {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError("Bad Credentials: User not found ");
    }
    return user;
  }),
  "user-pass",
);

async function verifyUser({ email, password }) {
  const user = await mongoose.models.User.findOne({ email }).select(
    "+password",
  );
  if (!user) {
    throw new AuthorizationError("Mail or password is incorrect");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthorizationError("Mail or password is incorrect");
  }

  // Set password to undefined to ensure it is not returned as part of the user object
  user.password = undefined;
  console.log("user", user);

  return user;
}
