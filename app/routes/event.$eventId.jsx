import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
// import PostCard from "../components/PostCard";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";

export function meta({ data }) {
  return [
    {
      title: `Silvestre - ${data.event.titel || "Event"}`,
    },
  ];
}

export async function loader({ params, request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const event = await mongoose.models.Events.findById(params.eventId);
  return json({ event });
}

export default function Event() {
  const { event } = useLoaderData();

  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this post.");
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <div id="post-page" className="page">
      <h1>{event.titel}</h1>
      <div className="btns">
        <Form action="update">
          <button>Update</button>
        </Form>
        <Form action="destroy" method="post" onSubmit={confirmDelete}>
          <button>Delete</button>
        </Form>
      </div>
    </div>
  );
}
