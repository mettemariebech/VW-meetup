import { json } from "@remix-run/node";
import { Form, useLoaderData, useFetcher } from "@remix-run/react";
// import PostCard from "../components/PostCard";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { format } from "date-fns";

export function meta({ data }) {
  return [
    {
      title: `Silvestre - ${data.event.titel || "Event"}`,
    },
  ];
}

export async function loader({ params, request }) {
  const user = await authenticator.isAuthenticated(request);

  const event = await mongoose.models.Events.findById(params.eventId).populate(
    "attendees",
    "username",
  );

  return json({ event, user });
}

export default function Event() {
  const { event, user } = useLoaderData();
  const fetcher = useFetcher();

  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this post.");
    if (!response) {
      event.preventDefault();
    }
  }

  async function handleAttend(event) {
    event.preventDefault();

    // Prepare the data to be sent
    const formData = new FormData();
    formData.append("_action", "attend");

    // Use fetcher to submit the form data
    fetcher.submit(formData, {
      method: "post",
      action: `/event/${event._id}`, // Your route that handles the post request
    });
  }

  async function handleUnattend(event) {
    event.preventDefault();

    // Prepare the data to be sent
    const formData = new FormData();
    formData.append("_action", "unattend");

    // Use fetcher to submit the form data
    fetcher.submit(formData, {
      method: "post",
      action: `/event/${event._id}`, // Your route that handles the post request
    });
  }

  const isUserHost =
    user && event.userID && event.userID.toString() === user._id.toString();

  const isAlreadyAttending =
    user && event.attendees.some((attendee) => attendee._id === user._id);

  return (
    <div id="post-page" className="page">
      <h1>{event.titel}</h1>
      <p>
        Beskrivelse:
        {event.description}
      </p>
      <div>Lokation: {event.place}</div>
      <div>Tidspunkt: {format(new Date(event.date), "dd/MM/yyyy HH:mm")}</div>

      <div>
        Attendees:
        <ul>
          {event.attendees.map((attendee, index) => (
            <li key={index}>{attendee.username}</li>
          ))}
        </ul>
      </div>
      {/* -------------------tilmeld-----------------------*/}
      <div className="btns">
        {user && !isUserHost && !isAlreadyAttending && (
          <>
            <Form
              method="post"
              action={`/event/${event._id}`}
              onSubmit={handleAttend}
            >
              <input type="hidden" name="_action" value="attend" />
              <button type="submit" className="bg-black float-left">
                Tilmeld
              </button>
            </Form>
          </>
        )}
      </div>
      {/* -------------------Frameld-----------------------*/}
      <div className="btns">
        {!isUserHost && isAlreadyAttending && (
          <>
            <Form
              method="post"
              action={`/event/${event._id}`}
              onSubmit={handleUnattend}
            >
              <input type="hidden" name="_action" value="unattend" />
              <button type="submit" className="bg-black float-left">
                Frameld
              </button>
            </Form>
          </>
        )}
      </div>
      {/* -------------------Update & delete-----------------------*/}
      <div className="btns">
        {user && event?.userID == user?._id && (
          <>
            <Form action="update">
              <button>Update</button>
            </Form>
            <Form action="destroy" method="post" onSubmit={confirmDelete}>
              <button>Delete</button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}

{
  /* -------------------Action-----------------------*/
}
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "attend") {
    const user = await authenticator.isAuthenticated(request);
    if (!user) {
      // Handle the case where the user is not authenticated
      return redirect("/signin");
    }

    const eventId = params.eventId;
    const event = await mongoose.models.Events.findById(eventId);

    if (!event) {
      // Handle the case where the event is not found
      return null;
    }

    // Check if the user is already an attendee
    if (event.attendees.includes(user._id)) {
      // Maybe you want to send a message back to the user that they're already attending
      return null;
    }

    // Add user to attendees
    event.attendees.push(user._id);
    await event.save();

    return redirect(`/profile`);
  }

  if (actionType === "unattend") {
    const user = await authenticator.isAuthenticated(request);
    if (!user) {
      // Handle the case where the user is not authenticated
      return redirect("/signin");
    }

    const eventId = params.eventId;
    const event = await mongoose.models.Events.findById(eventId);

    if (!event) {
      // Handle the case where the jam is not found
      return null;
    }

    // Remove the user from attendees
    event.attendees = event.attendees.filter(
      (attendeeId) => attendeeId.toString() !== user._id.toString(),
    );
    await event.save();

    return redirect(`/profile`);
  }
};
