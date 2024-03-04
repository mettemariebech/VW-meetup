// import React from "react";
import { Form } from "@remix-run/react";
// import { authenticator } from "../services/auth.server";
// import { sessionStorage } from "../services/session.server";
// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import { redirect } from "@remix-run/node";
// import mongoose from "mongoose";
// import { Link } from "@remix-run/react";

// export async function loader({ request }) {
//   // If the user is already authenticated redirect to /posts directly
//   await authenticator.isAuthenticated(request, {
//     successRedirect: "/posts"
//   });
//   // Retrieve error message from session if present
//   const session = await sessionStorage.getSession(request.headers.get("Cookie"));
//   // Get the error message from the session
//   const error = session.get("sessionErrorKey");
//   return json({ error }); // return the error message
// }

export default function SignIn() {
  //   const loaderData = useLoaderData();
  return (
    <div id="sign-up-page" className="wrapper">
      <h1>Sign Up</h1>
      <Form id="sign-up-form" method="post">
        <label htmlFor="mail">Mail:</label>
        <input
          id="mail"
          type="email"
          name="mail"
          aria-label="mail"
          placeholder="Type your mail..."
          required
        />

        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
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
          {/* {loaderData?.error ? <p>{loaderData?.error?.message}</p> : null} */}
        </div>
        <div className="btns">
          <button>Sign Up</button>
        </div>
      </Form>
      {/* <p>
        Already have an account? <Link to={"/signin"}>Sign in here!</Link>
      </p> */}
    </div>
  );
}

//   export async function action({ request }) {
//     const formData = await request.formData(); // get the form data
//     const newUser = Object.fromEntries(formData) // convert the form data to an object
//     const result = await mongoose.models.User.create(newUser); // create a new user

//     if (result) {
//       return redirect('/posts'); // redirect to /posts if successful
//     } else {
//       return redirect('/signup'); // redirect to /signup if not successful
//     }
//   }
