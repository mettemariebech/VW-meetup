import { Link } from "@remix-run/react";
import backgroundImage from "../images/yellow-bubble.jpg";
import logo from "../images/VWMeetup-logo.svg";

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
        absolute inset-0 bg-black opacity-10 
        md:hidden"
      ></div>

      {/* --------------Content-------------- */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center text-center
        md:static md:col-span-1"
      >
        <img src={logo} alt="Your Image" className="w-56 m-7" />

        <div className="space-x-4">
          {/* Buttons */}
          <Link
            to="/signin"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Sign up
          </Link>
        </div>
        <Link
          to="/events"
          className="text-white mt-8 underline text-lg 
          md:text-black"
        >
          Just browse meetups..
        </Link>
      </div>
    </div>
  );
}
