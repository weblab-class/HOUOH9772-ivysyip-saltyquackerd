import { React, useState, useContext } from "react";
import { get, post } from "../../utilities";
import { UserContext } from "../App";
import "./GroupPopup.css";

const GroupPopup = (props) => {
  const { userId } = useContext(UserContext);
  const [create, setCreate] = useState(false);
  const [selected, setSelected] = useState(false);
  const [groupCode, setGroupCode] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [inputGroupCode, setInputGroupCode] = useState("");

  function generateRandomGroupCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }

  const handleCreateSubmit = (event) => {
    event.preventDefault();

    if (groupName.trim()) {
      post("/api/newgroup", { join_code: groupCode, group_name: groupName, users: [userId] }).then(
        (group) => {
          setGroupName("");
          handleClose();

          props.refreshGroups();
        }
      );
    } else {
      alert("Please enter a valid name.");
    }
  };

  const handleJoinSubmit = (event) => {
    event.preventDefault();

    if (groupName.trim()) {
    } else {
      alert("Please enter a valid name.");
    }
  };

  const handleCreate = () => {
    setSelected(true);
    setCreate(true);
    setGroupCode(generateRandomGroupCode());
  };

  const handleJoin = () => {
    setSelected(true);
  };

  const handleClose = () => {
    setSelected(false);
    setCreate(false);
    props.setTrigger(false);
  };

  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={handleClose}>
          x
        </button>
        {!selected ? (
          <>
            <button onClick={handleCreate}>Create Group</button>
            <button onClick={handleJoin}>Join Group</button>
          </>
        ) : create ? (
          <div>
            <h2>Creating a group!</h2>
            <p>Your Group Code is: {groupCode}. Share with your friends!</p>
            <form onSubmit={handleCreateSubmit}>
              <label htmlFor="nameInput">Enter your group name:</label>
              <input
                type="text"
                id="nameInput"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Your Name"
                required
              />
              <button type="submit">Create Group</button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Joining a group!</h2>
            <form onSubmit={handleJoinSubmit}>
              <label htmlFor="codeInput">Enter your group code:</label>
              <input
                type="text"
                id="codeInput"
                value={inputGroupCode}
                onChange={(e) => setInputGroupCode(e.target.value)}
                placeholder="Your group code"
                required
              />
              <button type="submit">Create Group</button>
            </form>
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default GroupPopup;
