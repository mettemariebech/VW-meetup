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
    <div className="flex justify-center px-7 lg:px-0">
      <div className="max-w-xl">
        <div className="flex flex-col justify-center items-center mt-24">
          <h1 className="text-center text-4xl font-bold mb-5">Meetups</h1>
          <Form id="search-form" method="post" onSubmit={handleSubmit}>
            <input
              type="search"
              name="search"
              placeholder="Search"
              value={searchBar}
              className="placeholder-stone-700 p-2 mt-1 border border-stone-800 rounded bg-transparent max-w-lg"
            />

            <button
              name="_action"
              value="search"
              type="submit"
              className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent  font-medium rounded-lg text-sm px-8 py-2.5 mb-2 mt-2 ml-3"
            >
              Search
            </button>
          </Form>
          <NavLink
            to="/add-event"
            className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8  py-2.5 mb-4 mt-9 mr-auto"
          >
            Add Event
          </NavLink>
          <ul className="events-list">
            {search.map((event) => (
              <li key={event._id} className="border border-black mb-5 p-5">
                <Link
                  key={event._id}
                  className="event-link"
                  to={`/event/${event._id}`}
                >
                  <h2 className="font-bold">{event.titel}</h2>
                  <p className="event-description">{event.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
