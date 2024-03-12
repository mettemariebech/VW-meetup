import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { format } from "date-fns";

export function meta() {
  return [
    {
      title: "VW Meetup - Update",
    },
  ];
}

export async function loader({ params, request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const events = await mongoose.models.Events.findById(params.eventId);
  console.log(events, user);
  if (!events || events.userID.toString() !== user._id.toString()) {
    throw new Response("fail", { status: 404 });
  }

  const event = await mongoose.models.Events.findById(params.eventId);
  return json({ event });
}

export default function UpdateEvent() {
  const { event } = useLoaderData();
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div>
      <div>
        <div className="absolute inset-0 flex flex-col justify-center items-center max-w-xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-5">Update Meetup</h1>
          <Form className="flex flex-col max-w-lg" method="post">
            <label htmlFor="title" className="mt-3">
              Title
            </label>
            <input
              id="Title"
              name="titel"
              type="text"
              aria-label="title"
              defaultValue={event?.titel}
              className="placeholder-stone-700 w-72 max-w-xs p-2 mt-1 border border-stone-800 rounded bg-transparent"
            />

            <label htmlFor="description" className="mt-3">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              defaultValue={event?.description}
              className="placeholder-stone-700 w-72 max-w-xs p-2 mt-1 border border-stone-800 rounded bg-transparent"
            ></textarea>

            <label htmlFor="location" className="mt-3">
              location
            </label>
            <input
              id="location"
              name="place"
              type="text"
              aria-label="location"
              defaultValue={event?.place}
              className="placeholder-stone-700 w-72 max-w-xs p-2 mt-1 border border-stone-800 rounded bg-transparent"
            />
            <label htmlFor="date" className="mt-3">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              aria-label="location"
              defaultValue={
                event?.date
                  ? format(new Date(event.date), "yyyy-MM-dd'T'HH:mm")
                  : format(new Date(), "yyyy-MM-dd'T'HH:mm")
              }
              className="placeholder-stone-700 w-72 max-w-xs p-2 mt-1 border border-stone-800 rounded bg-transparent"
            />

            <div className="flex gap-4 justify-center mt-5">
              <button className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-32 text-center">
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-32 text-center"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  const formData = await request.formData();
  const events = Object.fromEntries(formData);

  await mongoose.models.Events.findByIdAndUpdate(params.eventId, {
    titel: events.titel,
    description: events.description,
    place: events.place,
    date: events.date,
  });

  return redirect(`/event/${params.eventId}`);
}
