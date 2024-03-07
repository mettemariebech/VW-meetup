import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
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

  const event = await mongoose.models.Events.findById(params.eventId);
  return json({ event, user });
}

export default function Event() {
  const { event, user } = useLoaderData();

  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this post.");
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <div id="post-page" className="page">
      <h1>{event.titel}</h1>
      <p>
        Beskrivelse:
        {event.description}
      </p>
      <div>Lokation: {event.place}</div>
      <div>Tidspunkt: {format(new Date(event.date), "dd/MM/yyyy HH:mm")}</div>
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
