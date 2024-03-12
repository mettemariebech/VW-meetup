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
    failureRedirect: "/",
  });
}

// ----------------------- UI ----------------------- //
export default function AddEvent() {
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div>
      <div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-center text-4xl font-bold">Add Meetup</h1>
          <Form className="flex flex-col max-w-lg px-5" method="post">
            <label htmlFor="title" className="mt-3">
              Title
            </label>
            <input
              id="title"
              name="titel"
              type="text"
              aria-label="title"
              placeholder="Write a title..."
              className="placeholder-stone-700 w-80 md:w-96 max-w-lg p-2 mt-1 border border-stone-800 rounded bg-transparent"
            />

            <label htmlFor="description" className="mt-3">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Write a description..."
              className="placeholder-stone-700 w-80 md:w-96 max-w-lg p-2 mt-1 border border-stone-800 rounded bg-transparent"
            ></textarea>

            <label htmlFor="location" className="mt-3">
              Location
            </label>
            <input
              id="location"
              name="place"
              type="text"
              aria-label="location"
              placeholder="Write the location..."
              className="placeholder-stone-700 w-80 md:w-96 max-w-lg p-2 mt-1 border border-stone-800 rounded bg-transparent"
            />
            <label htmlFor="date" className="mt-3">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              aria-label="location"
              defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="placeholder-stone-700 w-80 md:w-96 max-w-lg p-2 mt-1 border border-stone-800 rounded bg-transparent"
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

// ----------------------- Action ----------------------- //

export async function action({ request }) {
  const formData = await request.formData();
  const event = Object.fromEntries(formData);

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  console.log(user);

  event.userID = user._id;
  event.attendees = [user._id];

  await mongoose.models.Events.create(event);

  return redirect("/events");
}
