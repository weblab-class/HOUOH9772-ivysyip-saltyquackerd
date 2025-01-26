import "./DailyFeed.css";
import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import PhotoPopup from "../modules/PhotoPopup.jsx";


const DailyFeed = (props) => {
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  }

  useEffect(() => {
    if (props.userId) {
      get("/api/group", { userid: props.userId }).then((groups) => setGroups(groups));
    }
  }, [props.userId]);

  useEffect(() => {
    refreshGroups();
  }, []);

  const refreshGroups = () => {
  get("/api/group", { userid: props.userId })
      .then((groups) => {
      console.log("Fetched groups:", groups);
      setGroups(groups);
      })
      .catch((err) => console.error("Error fetching groups:", err));
  };

  let friendsList = [];
  if (groups.length > 0) {
    groups.forEach((group) => {
      group.users.forEach((user) => {
        if (!friendsList.some((friend) => friend === user)) {
          friendsList.push(user);
        }
      });
    });
  }
  friendsList = friendsList.filter((friend) => friend !== props.userId);

  async function getUserNames() {
    try {
      const responses = await Promise.all(
        friendsList.map((userId) => get(`/api/user`, { userid: userId }))
      );
      setFriends(responses.map((friend) => friend.name));
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  }

  useEffect(() => {
    getUserNames();
  }, [friendsList])

  return (
    <div className="daily-feed-container">
      <div className="feed-inner">
        {friends.map((friend, index) => (
          <button className="popup-option" onClick={togglePopup} key={friendsList[index]}>
            {friend}
          </button>
        ))}
        <div className="popup" style={{ display: isPopupVisible ? "block" : "none" }}>
          <div className="popup-inner">
            <button className="close-btn" onClick={togglePopup}>
              x
            </button>
            <PhotoPopup photo={friendsList[0]} />
          </div>
        </div>
      </div>
    </div>
  );

};
export default DailyFeed;