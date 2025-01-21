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

  let friendsList = [<p key="groupA">Group A</p>];
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

  return (
    <div className="u-homepage">
      {/* Insert below the challenge */}
      <h1 className="feed">
        {!user? (
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
            <form action="/action_page.php">
              <label htmlFor="input1">Upload Photo Here</label>
              <input type="file" id="input1" name="filename" />
              <input type="submit" />
            </form>
          </div>
        </div>
      </div>

      <h1 className="challenge">wear something blue</h1>
    </div>
  );};
export default Home;
