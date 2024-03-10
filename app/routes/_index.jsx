import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="wrapper">
      <div className="content">
        <Link to="/signin" className="btn">
          Sign in
        </Link>
        <Link to="/signup" className="btn">
          Sign up
        </Link>
        <Link to="/events" className="link">
          Browse meetups..
        </Link>
      </div>
    </div>
  );
}
