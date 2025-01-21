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
        setPopupVisible(!isPopupVisible)
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
          {props.userId && (
            <Link
              to={`/profile/${props.userId}`}
              className={`NavBar-link ${location.pathname === "/" ? "NavBar-link--active" : ""}`}
            >
              Profile
            </Link>
          )}
          <Link
            to="/friends/"
            className={`NavBar-link ${location.pathname === "/" ? "NavBar-link--active" : ""}`}
          >
            Friends
          </Link>
          <Link
            to="/badges/"
            className={`NavBar-link ${location.pathname === "/" ? "NavBar-link--active" : ""}`}
          >
            Badges
          </Link>
        </div>
        {/* <div className="popup" onClick={togglePopup}>
          <button className="setting">
            <img src={gearIcon} alt="Gear Icon" />
            {isPopupVisible && (
              <span className="popuptext show" id="myPopup">
                {userId ? (
                  <button
                    onClick={() => {
                      googleLogout();
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
                )}
              </span>
            )}
          </button>
        </div> */}
      </nav>
    );
}

export default NavBar;