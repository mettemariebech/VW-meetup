import { authenticator } from "~/services/auth.server";
import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const events = await mongoose.models.Events.find().exec();
  return json({ events });
}

export default function Events() {
  const { events } = useLoaderData();

  return (
    <div className="events-container">
      <h1>Events</h1>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <h2 className="event-title">{event.titel}</h2>
            <p className="event-description">{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
