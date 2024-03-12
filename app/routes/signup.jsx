import { Form } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { sessionStorage } from "../services/session.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { Link } from "@remix-run/react";
import ImageMega from "~/components/Image";

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
    <div className="relative h-screen md:grid md:grid-cols-2">
      <ImageMega />
      <div
        id="sign-in-page"
        className="absolute inset-0 flex flex-col justify-center items-center text-center
        md:static md:col-span-1"
      >
        <h1 className="text-center text-4xl font-bold">Sign Up</h1>
        <Form
          id="sign-up-form"
          method="post"
          className="flex flex-col max-w-lg"
        >
          <label htmlFor="mail" className="mt-3 text-left">
            Mail:
          </label>
          <input
            id="mail"
            type="email"
            name="email"
            aria-label="mail"
            placeholder="Type your mail..."
            required
            className="placeholder-stone-700 w-72 max-w-xs p-2 mt-1 border border-stone-800 rounded bg-transparent"
          />

          <label htmlFor="name" className="mt-3 text-left">
            Name:
          </label>
          <input
            id="name"
            type="text"
            name="username"
            aria-label="name"
            placeholder="Type your name..."
            required
            className="placeholder-stone-700 w-72 max-w-xs p-2 mt-1 border border-stone-800 rounded bg-transparent"
          />

          <label htmlFor="password" className="mt-3 text-left">
            Password:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            aria-label="password"
            placeholder="Type your password..."
            autoComplete="current-password"
            className="placeholder-stone-700 w-72 max-w-xs p-2 mt-1 border border-stone-800 rounded bg-transparent"
          />
          <div className="mt-5 text-center text-red-900">
            {loaderData?.error ? <p>{loaderData?.error?.message}</p> : null}
          </div>
          <div className="btns">
            <button className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent  font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-full mt-2">
              Sign Up
            </button>
          </div>
        </Form>
        <p className="mt-2">
          Already have an account? <br />
          <Link to={"/signin"}>
            <b>Sign in here!</b>
          </Link>
        </p>
      </div>
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
