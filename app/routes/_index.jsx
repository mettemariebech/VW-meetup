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
        <button className="btn">Sign in</button>
        <button className="btn">Sign up</button>
        <Link to="/events" className="link">
          Browse events..
        </Link>
      </div>
    </div>
  );
}
