import { authenticator } from "~/services/auth.server";
import { Form } from "@remix-run/react";
import mongoose from "mongoose";
import { json } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import profile from "../images/profile.jpg";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const userId = new mongoose.Types.ObjectId(user?._id);

  const myEvents = (
    await mongoose.models.Events.find().sort({ date: -1 })
  ).filter((entry) => {
    return entry.attendees.some((attendees) => {
      return attendees._id.equals(userId);
    });
  });

  const events = await mongoose.models.Events.find({ userID: userId }).exec();

  const username = await mongoose.models.User.findOne({ _id: userId });
  console.log(username);
  return json({ events, myEvents, username });
}

export default function Profile() {
  const { events, myEvents, username } = useLoaderData();
  return (
    // ------------Personal------------
    <div className="flex justify-center items-center h-screen">
      <div>
        <div className="flex place-items-center gap-3 text-2xl font-bold font-roboto mb-5">
          <img src={profile} alt="Logo" className="rounded-full  w-12" />
          <h1>{username.username}</h1>
        </div>
        <h2 className="text-xl mb-3">Your meetups</h2>
        <ul className="events-list">
          {events.map((event) => (
            <Link key={event._id} to={`/event/${event._id}`}>
              <li key={event._id} className="border border-black mb-5 p-5">
                <h3 className="">{event.titel}</h3>
              </li>
            </Link>
          ))}
        </ul>

        <h2 className="text-xl mb-3">Meetups you're attending</h2>
        <ul className="events-list">
          {myEvents.map((event) => (
            <Link
              key={event._id}
              className="event-link"
              to={`/event/${event._id}`}
            >
              <li key={event._id} className="border border-black mb-5 p-5">
                <h3 className="event-title">{event.titel}</h3>
              </li>
            </Link>
          ))}
        </ul>
        <Form id="profile-form" method="post">
          <button className="text-white bg-stone-400 border focus:outline-none hover:bg-stone-800 focus:ring-transparent  font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-full mt-2">
            Logout
          </button>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "../signin" });
}
