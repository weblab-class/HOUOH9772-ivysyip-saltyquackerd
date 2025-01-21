import React, { useContext } from "react";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <>
      <div className="u-homepage">
        <h1 className="home-title">Today's Challenge</h1>
      </div>
    </>
  );
};

export default Home;
