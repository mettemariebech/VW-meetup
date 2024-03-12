import { json } from "@remix-run/node";
import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { format } from "date-fns";
import { redirect } from "@remix-run/node";
import profile from "../images/profile.jpg";

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
    <div className="flex justify-center items-center h-screen max-w-xl mx-auto px-5">
      <div>
        <div id="meetup-page" className="page">
          <h1 className="text-2xl font-bold font-roboto mb-5 text-center">
            {event.titel}
          </h1>
          <p className="text-justify mb-5">{event.description}</p>
          <div className="flex justify-evenly">
            <div className="flex flex-col">
              <p className="text-center font-bold">Location</p>
              <p className="text-center"> {event.place}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-center font-bold">Time</p>
              <div className="text-center">
                {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
          </div>
          {/* -------------------Attendees-----------------------*/}
          <div className="flex flex-col items-center">
            <p className=" font-bold mt-7 mb-5 text-xl">Attendees</p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.attendees.map((attendee, index) => (
                <li key={index} className="flex items-center gap-1">
                  <img src={profile} alt="Logo" className="rounded-full w-7" />
                  <h1 className="font-roboto text-sm">{attendee.username}</h1>
                </li>
              ))}
            </ul>
          </div>
          {/* -------------------tilmeld-----------------------*/}
          <div class="flex justify-center mt-5">
            {user && !isUserHost && !isAlreadyAttending && (
              <>
                <Form method="post">
                  <button
                    type="submit"
                    name="_action"
                    value="attend"
                    className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-32 text-center"
                  >
                    Attend
                  </button>
                </Form>
              </>
            )}
          </div>
          {/* -------------------Frameld-----------------------*/}
          <div class="flex justify-center mt-5">
            {!isUserHost && isAlreadyAttending && (
              <>
                <Form method="post">
                  <button
                    type="submit"
                    name="_action"
                    value="unattend"
                    className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-32 text-center"
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
              <div className="flex gap-4 justify-center mt-5">
                <Form action="update">
                  <button className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-32 text-center">
                    Update
                  </button>
                </Form>
                <Form action="destroy" method="post" onSubmit={confirmDelete}>
                  <button className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8 py-2.5 mb-2 w-32 text-center">
                    Delete
                  </button>
                </Form>
              </div>
            )}
          </div>
        </div>
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

    return null;
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

    return null;
  }
};
