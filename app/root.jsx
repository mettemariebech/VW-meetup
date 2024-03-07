import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import maincss from "./main.css";
import Nav from "./components/Nav";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "./services/auth.server";

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
  return [{ title: "Silvestre" }];
}

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request);
}

export default function App() {
  const user = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {user ? <Nav /> : null}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
