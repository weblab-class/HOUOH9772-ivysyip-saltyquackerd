import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";

const Friends = () => {
  const { userId } = useContext(UserContext);
  const groups = [
    {
      join_code: "HELLOS",
      group_name: "whatever",
      users: ["user1", "user2", "user3"],
    },
    {
      join_code: "import",
      group_name: "group2",
      users: ["user2", "user3"],
    },
  ];

  let groupsList = null;
  const hasGroups = groups.length !== 0;
  if (hasGroups) {
    groupsList = groups.map((groupObj) => <p>{groupObj.group_name}</p>);
  } else {
    groupsList = <div>No stories!</div>;
  }
  console.log(groupsList);

  const handleNewGroup = () => {
    get("/api/getgroup").then(console.log("success"));
  };

  return !userId ? <>Please login</> : <div onClick={handleNewGroup}>{groupsList}</div>;
};

export default Friends;
