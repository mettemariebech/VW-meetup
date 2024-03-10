import { redirect } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { format } from "date-fns";

export const meta = () => {
  return [{ title: "VWeetup - Add New Event" }];
};
// ----------------------- Loader ----------------------- //
export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

// ----------------------- UI ----------------------- //
export default function AddEvent() {
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Add Meetup</h1>
      <Form className="event-form" method="post">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="titel"
          type="text"
          aria-label="title"
          placeholder="Write a title..."
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="Write a description..."
        ></textarea>

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="place"
          type="text"
          aria-label="location"
          placeholder="Write the location..."
        />
        <label htmlFor="date">Date</label>
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
