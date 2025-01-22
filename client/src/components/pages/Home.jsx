import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get } from "../../utilities";

import "../../utilities.css";
import "./Home.css";

import DailyFeed from "../modules/DailyFeed";

const Home = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [seen, setSeen] = useState(false);
  const [groups, setGroups] = useState([]);
  const[uploaded, setUploaded] = useState(null);

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
  }, []);
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploaded(file.name);
    } else {
      setUploaded(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploaded) {
      const formData = new FormData();
      formData.append("file", uploaded);
      try {
        const response = await fetch("/api/upload", {
          method: "POST", 
          body: formData, 
        });
      } catch (error) {
        console.error("Error:", error);
        alert(`Error submitting file: ${error.message}`);
      } finally {
        setUploaded(null);
      }
      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          console.log(data);
        }
      } else {
        console.error("Error:", response.statusText);
        alert(`Error submitting file: ${response.statusText}`);
      }
  } };


  return (
    <div className="u-homepage">
      {/* Insert below the challenge */}
      <DailyFeed />
      <h1 className="home-title">Today's Challenge</h1>
      <div className="challenge-upload">
        <div className="upload">
          <div className="button_group">
            <form onSubmit={handleSubmit}>
              <label htmlFor="input1">Upload Photo Here</label>
              <input type="file" id="input1" name="filename" onChange={handleUpload} />
              <input type="submit" value="Submit"/>
            </form>
          </div>
          {uploaded && (
            <p style={{ marginTop: "10px", color: "green" }}>
              Uploaded File: {uploaded}
            </p>
          )}
        </div>
      </div>

      <h1 className="challenge">wear something blue</h1>
    </div>
  );};
export default Home;
