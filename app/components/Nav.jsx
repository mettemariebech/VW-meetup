import { NavLink } from "@remix-run/react";
import logo from "../images/VWMeetup-small-logo.webp";

export default function Nav() {
  return (
    <nav className=" grid grid-cols-3 bg-transparent absolute top-0 w-full z-10">
      <NavLink
        to="/events"
        className="inline-block text-center px-4 py-6 no-underline uppercase font-semibold text-lg tracking-wide rounded-lg transition duration-500 ease-in-out"
      >
        Events
      </NavLink>
      {/* <NavLink
        to="/add-event"
        className="inline-block text-center px-4 py-6 no-underline uppercase font-semibold text-lg tracking-wide rounded-lg transition duration-500 ease-in-out"
      >
        Add Event
      </NavLink> */}
      <NavLink
        to="/"
        className="flex justify-center text-center px-4 py-6 no-underline uppercase font-semibold text-lg tracking-wide rounded-lg transition duration-500 ease-in-out "
      >
        <img src={logo} alt="Logo" className="w-11" />
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
