import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
// import Profile from "./components/pages/Profile";
// import Friends from "./components/pages/Friends";
// import Badges from "/components/pages/Badges";
import Welcome from "./components/pages/Welcome";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "935457940475-p7vk9j4bp0kkkqc91ajkckkhpkudjok9.apps.googleusercontent.com";

// Include once the pages are made
//      <Route path="/profile/:userId" element={<Profile />} />
//      <Route path="/friends/" element={<Friends />} />
//      <Route path="/badges/" element={<Badges />} />
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<Welcome />} />
      <Route path="/Home" element={<Home />} />
    </Route>
  )
);

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
