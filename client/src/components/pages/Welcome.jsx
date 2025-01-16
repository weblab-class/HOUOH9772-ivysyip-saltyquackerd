import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./Welcome.css";
import { UserContext } from "../App";

const Welcome = () => {
  const { handleLogin } = useContext(UserContext);
  return (
    <div className="u-welcome">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to picVenture!</h1>
        <GoogleLogin
          className="google-login"
          onSuccess={handleLogin}
          onError={(err) => console.log(err)}
        />
      </div>
    </div>
  );
};

export default Welcome;
