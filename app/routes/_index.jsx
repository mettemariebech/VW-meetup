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
    <div className="wrapper">
      <div className="content">
        <Link to="/signin" className="btn">
          Sign in
        </Link>
        <Link to="/signup" className="btn">
          Sign up
        </Link>
        <Link to="/events" className="link">
          Browse events..
        </Link>
      </div>
    </div>
  );
}
