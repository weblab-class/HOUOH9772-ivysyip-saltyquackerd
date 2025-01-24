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

  const handleJoinSubmit = async (event) => {
    event.preventDefault();

    if (inputGroupCode.trim()) {
      try {
        const response = await fetch("/api/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            join_code: inputGroupCode,
            userId: userId,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setInputGroupCode("");
          handleClose();
          props.refreshGroups();
        } else {
          alert(result.error || "Failed to join the group. Please try again.");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please enter a valid group code.");
    }
  };

  async function fetchGroupCode() {
    try {
      const response = await fetch("/api/code");
      if (response.ok) {
        const data = await response.json();
        return data.groupCode;
      } else {
        throw new Error("Failed to fetch group code");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleCreate = () => {
    setSelected(true);
    setCreate(true);
    fetchGroupCode().then((code) => {
      setGroupCode(code);
    });
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
            <button className="button" onClick={handleCreate}>
              Create Group
            </button>
            <button className="button" onClick={handleJoin}>
              Join Group
            </button>
          </>
        ) : create ? (
          <div>
            <h2 className="group-title">Creating a group!</h2>
            <p className="code">Your Group Code is: {groupCode}. Share with your friends!</p>
            <form className="form-obj" onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="prompt" htmlFor="nameInput">
                  Enter your group name
                </label>
                <input
                  type="text"
                  id="nameInput"
                  className="create-input"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Your Group Name"
                  required
                />
              </div>
              <button className="submit-btn" type="submit">
                Create Group
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="group-title">Joining a group!</h2>
            <form className="form-obj" onSubmit={handleJoinSubmit}>
              <div className="form-group">
                <label className="prompt" htmlFor="codeInput">
                  Enter your group code
                </label>
                <input
                  type="text"
                  id="codeInput"
                  className="join-input"
                  value={inputGroupCode}
                  onChange={(e) => setInputGroupCode(e.target.value.toUpperCase())}
                  placeholder="Your group code"
                  required
                />
              </div>
              <button className="submit-btn" type="submit">
                Join Group
              </button>
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
