import { React, useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import { Link } from "react-router-dom";
import "./GroupList.css";

const GroupList = (props) => {
  const { userId } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const leaveGroup = () => {
    post("/api/leavegroup", { groupId: props.group._id, userId: userId }).then(() => {
      closePopup();
      props.refreshGroups();
    });
  };

  useEffect(() => {
    setUsers([]);
    if (props.group) {
      props.group.users.forEach((user) => {
        get("/api/user", { userid: user }).then((user) => {
          setUsers((prevUsers) => [...prevUsers, user]);
        });
      });
    }
  }, [props.group]);

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);
  return (
    <div className="group-list-container">
      {props.group ? (
        <>
          <h1 className="group-name">
            {props.group.group_name} ({props.group.join_code})
          </h1>
          {users.map((user) => (
            <Link className="profile-links" to={`/profile/${user._id}`}>
              {user.name}
            </Link>
          ))}
          <button className="leave-group-button" onClick={togglePopup}>
            Leave Group
          </button>
        </>
      ) : (
        "No groups currently. Join a Group!"
      )}
      {isOpen ? (
        <div className="popup">
          <div className="popup-inner">
            <h3 className="popup-header">Are you sure you want to leave?</h3>
            <div className="popup-actions">
              <button className="popup-button confirm" onClick={leaveGroup}>
                Confirm
              </button>
              <button className="popup-button cancel" onClick={closePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GroupList;
