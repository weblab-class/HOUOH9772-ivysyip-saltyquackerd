import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "./NavBar.css";
import { UserContext } from "../App";
import gearIcon from "../assets/gear.png";
import "../../utilities.css";

const NavBar = (props) => {
  const location = useLocation();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleClose = () => {
    setPopupVisible(false);
  };

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
            to={`/badges/${props.userId}`}
            className={`NavBar-link ${
              location.pathname === "/badges" ? "NavBar-link--active" : ""
            }`}
          >
            Badges
          </Link>
        )}
      </div>
      <div className="popup-container">
        <button className="setting" onClick={togglePopup}>
          <img src={gearIcon} alt="Gear Icon" />
        </button>
        <div className="popup" style={{ display: isPopupVisible ? "block" : "none" }}>
          <div className="popuptext">
            <button className="close-btn" onClick={handleClose}>
              x
            </button>
            {userId ? (
              <button
                className="popup-option"
                onClick={() => {
                  googleLogout();
                  handleLogout();
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
            <button className="popup-option">Color Change</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
