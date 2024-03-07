import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { format } from "date-fns";

export function meta() {
  return [
    {
      title: "Silvestre - Update",
    },
  ];
}

export async function loader({ params, request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  // const events = await mongoose.models.Events.findById(params.eventId);
  // console.log(events, user);
  // if (!events || events.userID !== user._id) {
  //   // Event not found or user is not the owner
  //   throw new Response("fail", { status: 404 });
  // }

  const event = await mongoose.models.Events.findById(params.eventId);
  //   .populate(
  //     "User",
  //   );
  return json({ event });
}

export default function UpdateEvent() {
  const { event } = useLoaderData();
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Add an event</h1>
      <Form id="event-form" method="post">
        <label htmlFor="overskrift">Overskrift</label>
        <input
          id="overskrift"
          name="titel"
          type="text"
          aria-label="overskrift"
          defaultValue={event?.titel}
        />

        <label htmlFor="beskrivelse">Beskrivelse</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          defaultValue={event?.description}
        ></textarea>

        <label htmlFor="location">Lokation</label>
        <input
          id="location"
          name="place"
          type="text"
          aria-label="location"
          defaultValue={event?.place}
        />
        <label htmlFor="date">Dato</label>
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
        />

        <div className="btns">
          <button>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </Form>
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
