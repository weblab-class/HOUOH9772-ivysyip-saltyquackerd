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
          <div class="button_group">
            <form action="/action_page.php">
              <label for="input1">Upload Photo Here</label>
              <input type="file" id="input1" name="filename" />
              <input type="submit" />
            </form>
          </div>
        </div>
      </div>

      <h1 className="challenge">wear something blue</h1>
      <h1 className="feed">
      </h1>
    </div>
  );};
export default Home;