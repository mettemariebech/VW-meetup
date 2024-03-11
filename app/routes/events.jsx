import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useActionData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import { NavLink } from "@remix-run/react";

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

        <button
          name="_action"
          value="search"
          type="submit"
          className="bg-black"
        >
          Search
        </button>
      </Form>
      <h1>Meetups</h1>
      <NavLink
        to="/add-event"
        className="inline-block text-center px-4 py-6 no-underline uppercase font-semibold text-lg tracking-wide rounded-lg transition duration-500 ease-in-out"
      >
        Add Event
      </NavLink>
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
      ],
    });
    return json(searchedEvents);
  }
}
