import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { usePopup } from "./PopupContext.jsx";

import "./NavBar.css";
import { UserContext } from "../App";
import gearIcon from "../assets/gear.png";
import "../../utilities.css";

const NavBar = (props) => {

  
  const location = useLocation();
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  const { activePopup, setActivePopup } = usePopup();
  const openSettings = () => setActivePopup("settings");
  const closeSettings = () => setActivePopup(null);

  return (
    <nav className="NavBar-container">
      <div className="NavBar-linkContainer u-inlineBlock">
        <Link
          to="/"
          className={`NavBar-link ${location.pathname === "/" ? "NavBar-link--active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/friends/"
          className={`NavBar-link ${
            location.pathname === "/friends/" ? "NavBar-link--active" : ""
          }`}
        >
          Friends
        </Link>
        <Link
          to={`/profile/${props.userId}`}
          className={`NavBar-link ${
            location.pathname.startsWith("/profile/") ? "NavBar-link--active" : ""
          }`}
        >
          Profile
        </Link>
        {props.userId && (
          <Link
            to={`/badges`}
            className={`NavBar-link ${
              location.pathname === "/badges" ? "NavBar-link--active" : ""
            }`}
          >
            Badges
          </Link>
        )}
      </div>
      <div className="navbar-popup-container">
        <button className={`settings ${activePopup ? "hidden" : ""}`} onClick={openSettings}>
          <img src={gearIcon} alt="Gear Icon" />
        </button>
        {activePopup === "settings" && (
          <div
            className="navbar-popup-overlay"
            style={{ display: openSettings ? "block" : "none" }}
          >
            <div className="navbar-popup">
              <div className="navbar-popuptext">
                <button className="close-btn" onClick={closeSettings}>
                  x
                </button>
                {userId ? (
                  <button
                    className="navbar-popup-option"
                    onClick={() => {
                      googleLogout();
                      handleLogout();
                      closeSettings();
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <GoogleLogin
                    key="google-login"
                    onSuccess={handleLogin}
                    onError={(err) => console.log(err)}
                  />
                )}
                {/* <button className="navbar-popup-option">Color Change</button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
