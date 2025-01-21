import { React, useEffect, useState } from "react";
import { get, post } from "../../utilities";
import { Link } from "react-router-dom";
import "./GroupList.css";

const GroupList = (props) => {
  const [users, setUsers] = useState([]);
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
        </>
      ) : (
        "No groups currently. Join a Group!"
      )}
    </div>
  );
};

export default GroupList;
