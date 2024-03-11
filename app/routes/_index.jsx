import { Link } from "@remix-run/react";
import backgroundImage from "../images/yellow-bubble-noise.jpg";
import logo from "../images/VWMeetup-logo_stone.webp";

export default function Index() {
  return (
    <div className="relative h-screen md:grid md:grid-cols-2">
      {/* Image */}
      <div className="md:col-span-1">
        <img
          src={backgroundImage}
          alt="Logo"
          className="absolute inset-0 w-full h-full object-cover 
          md:static md:h-auto md:max-h-screen"
        />
      </div>

      {/* --------------Overlay-------------- */}
      <div
        className="
        absolute inset-0 bg-stone-400 opacity-50 
        md:hidden"
      ></div>

      {/* --------------Content-------------- */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center text-center
        md:static md:col-span-1"
      >
        <img src={logo} alt="Your Image" className="w-64 m-7 font-urbane" />
        <div className="space-x-4">
          {/* Buttons */}
          <Link
            to="/signin"
            className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-8 py-2.5 mb-2"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-white bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent  font-medium rounded-lg text-sm px-8 py-2.5 mb-2"
          >
            Sign up
          </Link>
        </div>
        <Link
          to="/events"
          className="text-stone-50 bg-stone-800 border border-stone-800 focus:outline-none hover:bg-stone-700 focus:ring-transparent font-medium rounded-lg text-sm px-12 py-2.5 mb-2 my-6"
        >
          Just browse meetups..
        </Link>
      </div>
    </div>
  );
}
