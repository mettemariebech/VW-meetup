import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "../services/session.server";
import { json, useLoaderData } from "@remix-run/react";

// -------------------- Loader -------------------- //

export async function loader({ request }) {
  // If the user is already authenticated redirect to /posts directly
  await authenticator.isAuthenticated(request, {
    successRedirect: "/profile",
  });

  // Retrieve error message from session if present
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  // Get the error message from the session
  const error = session.get("sessionErrorKey");
  return json({ error }); // return the error message
}

// -------------------- UI -------------------- //

export default function SignIn() {
  const loaderData = useLoaderData();
  console.log("loaderData", loaderData);

  return (
    <div id="sign-in-page" className="wrapper">
      <h1>Sign In</h1>
      <Form id="sign-in-form" method="post">
        <label htmlFor="mail">Mail</label>
        <input
          id="mail"
          type="email"
          name="mail"
          aria-label="mail"
          placeholder="Type your mail..."
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          aria-label="password"
          placeholder="Type your password..."
          autoComplete="current-password"
        />
        <div className="error-message">
          {loaderData?.error ? <p>{loaderData?.error?.message}</p> : null}
        </div>
        <div className="btns">
          <button>Sign In</button>
        </div>
      </Form>
    </div>
  );
}

// -------------------- Action -------------------- //

export async function action({ request }) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/profile",
    failureRedirect: "/signin",
  });
}
