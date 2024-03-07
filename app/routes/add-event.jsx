import { redirect } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import { authenticator } from "../services/auth.server";
import { format } from "date-fns";

export const meta = () => {
  return [{ title: "Silvestre - Add New Event" }];
};
// ----------------------- Loader ----------------------- //
export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

// ----------------------- UI ----------------------- //
export default function AddPost() {
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Add an event</h1>
      <Form className="event-form" method="post">
        <label htmlFor="overskrift">Overskrift</label>
        <input
          id="overskrift"
          name="titel"
          type="text"
          aria-label="overskrift"
          placeholder="Skriv en overskrift..."
        />

        <label htmlFor="beskrivelse">Beskrivelse</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="Skriv en beskrivelse..."
        ></textarea>

        <label htmlFor="location">Lokation</label>
        <input
          id="location"
          name="place"
          type="text"
          aria-label="location"
          placeholder="Skriv lokationen..."
        />
        <label htmlFor="date">Dato</label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          aria-label="location"
          defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
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

// ----------------------- Action ----------------------- //

export async function action({ request }) {
  const formData = await request.formData();
  const event = Object.fromEntries(formData);

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  console.log(user);

  event.userID = user._id;

  await mongoose.models.Events.create(event);

  return redirect("/events");
}
