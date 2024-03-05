import { authenticator } from "~/services/auth.server";
import { Form } from "@remix-run/react";

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

export default function Profile() {
  // const user = useLoaderData();
  return (
    <div id="profile-page" className="page">
      <h1>Profile</h1>

      <Form id="profile-form" method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "../signin" });
}
