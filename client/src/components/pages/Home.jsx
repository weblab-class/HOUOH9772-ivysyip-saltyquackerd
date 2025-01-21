import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Home.css";

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

  useEffect(() => {
    refreshGroups();
  }, []);

  const refreshGroups = () => {
    get("/api/group", { userid: userId }).then((groups) => setGroups(groups));
  };

  let friendsList = [];
  if(groups !== null) {
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i].users.length; j++) {
        if (friendsList.some((friend) => friend.props.children.trim() === groups[i].users[j])) {
          continue;
        } else {
          friendsList.push(<p key={`${i}-${j}`}>{groups[i].users[j]}</p>);
        }
      }
    }
  }

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
      <h1 className="feed">
        {!user ? (
          <></>
        ) : (
          <div>
            <button onClick={() => setSeen(true)}></button>
          </div>
        )}
        {friendsList}
      </h1>
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
