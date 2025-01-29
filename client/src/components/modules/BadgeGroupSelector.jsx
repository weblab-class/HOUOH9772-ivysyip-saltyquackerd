import { React, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import BadgeGroupFeed from "./BadgeGroupFeed";
import "./BadgeGroupSelector.css";

const BadgeGroupSelector = (props) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  useEffect(() => {
    get("/api/group", { userid: props.user._id }).then((userGroups) => {
      setGroups(userGroups);
    });
  }, []);

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  return (
    <div className="group-selector-container">
      <label htmlFor="group-selector">Select Group:</label>
      <select id="group-selector" value={selectedGroup} onChange={handleGroupChange}>
        <option value="">-- Select Group --</option>
        {groups.map((group) => (
          <option key={group._id} value={group._id}>
            {group.group_name}
          </option>
        ))}
      </select>
      {selectedGroup ? <BadgeGroupFeed group={selectedGroup} /> : <></>}
    </div>
  );
};

export default BadgeGroupSelector;
