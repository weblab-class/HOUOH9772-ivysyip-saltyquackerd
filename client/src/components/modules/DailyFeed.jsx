import "./DailyFeed.css";
import React, { useState, useEffect } from "react";
import { get } from "../../utilities";

const DailyFeed = ({ userId }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (userId) {
      get("/api/group", { userid: userId }).then((groups) => setGroups(groups));
    }
  }, [userId]);

//   useEffect(() => {
//     refreshGroups();
//   }, []);

// const refreshGroups = () => {
//   get("/api/group", { userid: userId })
//     .then((groups) => {
//       console.log("Fetched groups:", groups);
//       setGroups(groups);
//     })
//     .catch((err) => console.error("Error fetching groups:", err));
// };

// const handleCreateGroup = async (groupData) => {
//   try {
//     const response = await post("/api/group", groupData);
//     console.log("Group created:", response);
//     refreshGroups(); // Ensure we refresh groups after creating one
//   } catch (error) {
//     console.error("Error creating group:", error);
//   }
// };


  const friendsList = [];
  if (groups.length > 0) {
    groups.forEach((group, i) => {
      group.users.forEach((user, j) => {
        if (!friendsList.some((friend) => friend.props.children.trim() === user)) {
          friendsList.push(<p key={`${i}-${j}`}>{user}</p>);
        }
      });
    });
  }

  return (
    <div className="daily-feed-container">
      <h1>Friends List</h1>
      {friendsList}
    </div>
  );

};
export default DailyFeed;