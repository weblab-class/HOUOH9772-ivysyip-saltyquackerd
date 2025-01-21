import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Home from "./components/pages/Home";
import Friends from "./components/pages/Friends";
import NotFound from "./components/pages/NotFound";
// import Badges from "/components/pages/Badges";
import Welcome from "./components/pages/Welcome";
import Profile from "./components/pages/Profile";
import EditPage from "./components/pages/EditPage";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "935457940475-p7vk9j4bp0kkkqc91ajkckkhpkudjok9.apps.googleusercontent.com";

//      <Route path="/badges/" element={<Badges />} />
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/accounts/edit/:userId" element={<EditPage />} />
      <Route path="/friends" element={<Friends />} />
    </Route>
  )
);

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
