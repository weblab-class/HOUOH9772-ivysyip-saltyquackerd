import "./DailyFeed.css";
import React, { useState, useEffect, useMemo } from "react";
import { get } from "../../utilities";
import PhotoPopup from "../modules/PhotoPopup.jsx";
import defaultImage from "../../assets/Default_pfp.jpg"; //CHANGE THIS

const DailyFeed = (props) => {
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [dailyPicture, setDailyPicture] = useState([]);
  const [user, setUser] = useState(null);

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

  const friendsList = useMemo (() => {
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
    return friendsList.filter((friend) => friend !== props.userId);
  }, [groups, props.userId]);

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



  useEffect(() => {
    if (props.userId !== user?.id) {
      get(`/api/user`, { userid: props.userId }).then((userObj) => {
        setUser(userObj);
        setDailyPicture(userObj.dailyPicture);
      });
    }
  }, [props.userId]);

  return (
    <div className="daily-feed-container">
      <div className="feed-inner">
        {friends.map((friend, index) => (
          <div userId={friends[index].id}>
            {dailyPicture && (
              <div
                className="feed-popup-overlay"
                style={{ display: isPopupVisible ? "block" : "none" }}q
                onClick={togglePopup}
              >
                <div className="feed-popup-container">
                  <div className="feed-popup">
                    <div className="feed-popup-inner">
                      <PhotoPopup
                        _id={friendsList[index].id}
                        closeModal={togglePopup}
                        link={dailyPicture}
                        creator_id={props.creator_id}
                        userId={props.userId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

};
export default DailyFeed;