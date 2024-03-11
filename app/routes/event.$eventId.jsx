import { json } from "@remix-run/node";
import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { format } from "date-fns";
import { redirect } from "@remix-run/node";
import BackArrow from "~/components/BackArrow";

export function meta({ data }) {
  return [
    {
      title: `VW Meetup - ${data.event.titel || "Meetups"}`,
    },
  ];
}
// ------------------------------------Loader----------------------------------------
export async function loader({ params, request }) {
  const user = await authenticator.isAuthenticated(request);

  const event = await mongoose.models.Events.findById(params.eventId).populate(
    "attendees",
    "username",
  );

  return json({ event, user });
}
// ------------------------------------Event UI----------------------------------------
export default function Event() {
  const { event, user } = useLoaderData();
  const fetcher = useFetcher();

  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this meetup.");
    if (!response) {
      event.preventDefault();
    }
  }

  async function handleAttend(event) {
    // Prepare the data to be sent
    const formData = new FormData();
    formData.append("_action", "attend");
  }

  async function handleUnattend(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("_action", "unattend");

    fetcher.submit(formData, {
      method: "post",
      action: `/event/${event._id}`,
    });
  }

  const isUserHost =
    user && event.userID && event.userID.toString() === user._id.toString();

  const isAlreadyAttending =
    user && event.attendees.some((attendee) => attendee._id === user._id);

  return (
    <div id="meetup-page" className="page">
      <BackArrow />
      <h1>{event.titel}</h1>
      <p>
        Description:
        {event.description}
      </p>
      <div>Location: {event.place}</div>
      <div>Time: {format(new Date(event.date), "dd/MM/yyyy HH:mm")}</div>

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
            <Form method="post">
              <button
                type="submit"
                name="_action"
                value="attend"
                className="bg-black float-left"
              >
                Attend
              </button>
            </Form>
          </>
        )}
      </div>
      {/* -------------------Frameld-----------------------*/}
      <div className="btns">
        {!isUserHost && isAlreadyAttending && (
          <>
            <Form method="post">
              <button
                type="submit"
                name="_action"
                value="unattend"
                className="bg-black float-left"
              >
                Unattend
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

  /* ------------tilføj attend--------------*/
  if (actionType === "attend") {
    const user = await authenticator.isAuthenticated(request);
    if (!user) {
      return redirect("/signin");
    }
    const userId = user._id;
    const eventId = new mongoose.Types.ObjectId(params.eventId);
    console.log(eventId);
    const event = await mongoose.models.Events.findOneAndUpdate(eventId, {
      $push: {
        attendees: userId,
      },
    });

    if (!event) {
      return null;
    }

    if (event.attendees.includes(user._id)) {
      return null;
    }

    return redirect(`/profile`);
  }

  /* ------------fjern attend--------------*/
  if (actionType === "unattend") {
    const user = await authenticator.isAuthenticated(request);
    if (!user) {
      return redirect("/signin");
    }

    const userId = user._id;
    const eventId = new mongoose.Types.ObjectId(params.eventId);
    console.log(eventId);
    const event = await mongoose.models.Events.findOneAndUpdate(eventId, {
      $pull: {
        attendees: userId,
      },
    });

    if (!event) {
      return null;
    }

    event.attendees = event.attendees.filter(
      (attendeeId) => attendeeId.toString() !== user._id.toString(),
    );
    await event.save();

    return redirect(`/profile`);
  }
};
