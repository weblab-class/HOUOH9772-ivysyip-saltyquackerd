import React, { useContext } from "react";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <div className="u-homepage">
      {/* Insert below the challenge */}
      <h1 className="home-title">Today's Challenge</h1>
      <div className="challenge-upload">
        <div className="upload">
          <form action="/action_page.php">
            <input type="file" id="myFile" name="filename" />
            <input type="submit" />
          </form>
        </div>
      </div>
      <h1 className="challenge">wear something blue</h1>
    </di
  );};
export default Home;