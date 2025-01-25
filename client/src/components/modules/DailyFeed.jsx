import "./DailyFeed.css";
import React, { useState, useEffect } from "react";
import { get } from "../../utilities";


const DailyFeed = (props) => {
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);

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

//   function getUserName(userId) {
//    get(`/api/user`, {userid: userId}).then((friend) => {
//     setFriends([...friends, friend.name]);
//    })
//   }

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
//  let friendsUser = [];
//   for (let i = 0; i < friendsList.length; i++) {
//     const userId = friendsList[i];
//     getUserName(userId);

//     // if (userName) {
//     //   friendsUser.push({userName});
//     // }
//   }

  return (
    <div className="daily-feed-container">
      <>
        {friends.map((friend, index) => (
          <p key={friendsList[index]}>{friend}</p>
        ))}
      </>
    </div>
  );

};
export default DailyFeed;