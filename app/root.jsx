import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import maincss from "./main.css";
import Nav from "./components/Nav";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "./services/auth.server";
import favicon from "app/images/VWMeetup-fv.png";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: maincss,
  },
];

export function meta() {
  return [{ title: "VWeetUp" }];
}

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request);
}

export default function App() {
  const user = useLoaderData();
  return (
    <html lang="en" className="h-full m-0 p-0">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={favicon}></link>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/feo1kzq.css"
        ></link>
        <Meta />
        <Links />
      </head>
      <body className="h-full m-0 p-0 bg-stone-200 font-roboto text-stone-800">
        {user ? <Nav /> : null}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <p className="text-3xl">Whoops!</p>

        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} – {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p>{error.message}</p>
        ) : (
          <p>Something happened.</p>
        )}

        <Scripts />
      </body>
    </html>
  );
}
