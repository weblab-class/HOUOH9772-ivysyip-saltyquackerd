import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const Home = (props) => {
  const { userId } = useContext(UserContext);
  return (
    <>
      <div>Home</div>
      <Link to={`/profile/${userId}`}>Profile</Link>
    </>
  );
};

export default Home;
