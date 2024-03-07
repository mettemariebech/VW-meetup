import { redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";

export async function loader({ params, request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const events = await mongoose.models.Events.findOne({
    where: { id: params.eventId },
  });
  if (!events || events.userId !== user.id) {
    // Event not found or user is not the owner
    throw new Response("fail", { status: 404 });
  }
}

export async function action({ params, request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  await mongoose.models.Events.findByIdAndDelete(params.eventId);
  return redirect("/events");
}
