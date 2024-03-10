import { Form } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { sessionStorage } from "../services/session.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { Link } from "@remix-run/react";
import BackArrow from "~/components/BackArrow";

export async function loader({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/profile",
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const error = session.get("sessionErrorKey");
  return json({ error });
}

export default function SignUp() {
  const loaderData = useLoaderData();
  return (
    <div id="sign-up-page" className="wrapper">
      <BackArrow />
      <h1>Sign Up</h1>
      <Form id="sign-up-form" method="post">
        <label htmlFor="mail">Mail:</label>
        <input
          id="mail"
          type="email"
          name="email"
          aria-label="mail"
          placeholder="Type your mail..."
          required
        />

        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="username"
          aria-label="name"
          placeholder="Type your name..."
          required
        />

        <label htmlFor="password">Password:</label>
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
          <button>Sign Up</button>
        </div>
      </Form>
      <p>
        Already have an account?{" "}
        <Link to={"/signin"}>
          <b>Sign in here!</b>
        </Link>
      </p>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const newUser = Object.fromEntries(formData);
  const result = await mongoose.models.User.create(newUser);

  if (result) {
    return redirect("/profile");
  } else {
    return redirect("/signup");
  }
}
