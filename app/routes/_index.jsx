// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import mongoose from "mongoose";
import { Link } from "@remix-run/react";

// export async function loader() {
//   const events = await mongoose.models.Events.find({});
//   return json({ entries: events });
// }

export default function Index() {
  // const events = useLoaderData();

  return (
    <div class="wrapper">
      <div class="content">
        <button class="btn">Sign in</button>
        <button class="btn">Sign up</button>
        <Link to="/events" class="link">
          Browse events..
        </Link>
      </div>
    </div>
  );
}
