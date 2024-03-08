import { authenticator } from "~/services/auth.server";
import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useActionData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";

export async function loader({ request }) {
  const events = await mongoose.models.Events.find().exec();
  return json({ events });
}

function handleSubmit(event) {}

export default function Events() {
  let { events } = useLoaderData();
  const searchedEvents = useActionData();
  const [search, setSearch] = useState(events);
  const [searchBar, setSearchBar] = useState();

  useEffect(() => {
    if (searchedEvents && searchedEvents !== events) {
      setSearch(searchedEvents);
    }
  }, [searchedEvents, events]);

  return (
    <div className="events-container">
      <Form id="search-form" method="post" onSubmit={handleSubmit}>
        <input
          type="search"
          name="search"
          placeholder="Search"
          value={searchBar}
        />
        <input
          className="px-3 text-slate-700 mx-2 rounded-md"
          type="datetime-local"
          name="date"
        />
        <button
          name="_action"
          value="search"
          type="submit"
          className="bg-black"
        >
          Search
        </button>
      </Form>
      <h1>Events</h1>
      <ul className="events-list">
        {search.map((event) => (
          <li key={event._id} className="event-item">
            <Link
              key={event._id}
              className="event-link"
              to={`/event/${event._id}`}
            >
              <h2 className="event-title">{event.titel}</h2>
              <p className="event-description">{event.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const { _action, search, date } = Object.fromEntries(formData);
  if (_action === "search") {
    const q = search;
    const searchedEvents = await mongoose.models.Events.find({
      $or: [
        { titel: { $regex: new RegExp(q), $options: "i" } },
        { description: { $regex: new RegExp(q), $options: "i" } },
        { place: { $regex: new RegExp(q), $options: "i" } },
        { date: { $gte: date } },
      ],
    });
    return json(searchedEvents);
  }
}
