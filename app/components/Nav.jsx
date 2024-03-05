import { NavLink } from "@remix-run/react";

export default function Nav() {
  return (
    <nav>
      <NavLink to="/events">Events</NavLink>
      <NavLink to="/add-event">Add Event</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  );
}
