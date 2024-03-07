import { redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";

export async function action({ params, request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  await mongoose.models.Events.findByIdAndDelete(params.eventId);
  return redirect("/events");
}
