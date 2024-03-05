import { authenticator } from "~/services/auth.server";
import { Form } from "@remix-run/react";
import mongoose from "mongoose";
import { json } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";

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
  return json({ events, myEvents });
}

export default function Profile() {
  const { events, myEvents } = useLoaderData();
  return (
    <div id="profile-page" className="page">
      <h1>Profile</h1>
      <h2>Dine events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <Link
            key={event._id}
            className="event-link"
            to={`/event/${event._id}`}
          >
            <li key={event._id} className="event-item">
              <h3 className="event-title">{event.titel}</h3>
            </li>
          </Link>
        ))}
      </ul>

      <h2>Tilmeldte events</h2>
      <ul className="events-list">
        {myEvents.map((event) => (
          <Link
            key={event._id}
            className="event-link"
            to={`/event/${event._id}`}
          >
            <li key={event._id} className="event-item">
              <h3 className="event-title">{event.titel}</h3>
            </li>
          </Link>
        ))}
      </ul>
      <Form id="profile-form" method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "../signin" });
}
