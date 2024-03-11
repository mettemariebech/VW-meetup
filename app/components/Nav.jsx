import { NavLink } from "@remix-run/react";

export default function Nav() {
  return (
    <nav
      className=" grid grid-cols-3"
    >
      <NavLink
        to="/events"
        className="inline-block text-center px-4 py-6 no-underline uppercase font-semibold text-lg tracking-wide rounded-lg transition duration-500 ease-in-out"
      >
        Events
      </NavLink>
      <NavLink
        to="/add-event"
        className="inline-block text-center px-4 py-6 no-underline uppercase font-semibold text-lg tracking-wide rounded-lg transition duration-500 ease-in-out"
      >
        Add Event
      </NavLink>
      <NavLink
        to="/profile"
        className="inline-block text-center px-4 py-6  uppercase font-semibold text-lg tracking-wide rounded-lg transition duration-500 ease-in-out"
      >
        Profile
      </NavLink>
    </nav>
  );
}
