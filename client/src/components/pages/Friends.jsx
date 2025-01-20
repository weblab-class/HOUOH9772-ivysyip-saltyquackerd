import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import Tabs from "../modules/Tabs";
import "./Friends.css";

const Friends = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
  }, []);

  // let groupsList = null;
  // const hasGroups = groups.length !== 0;
  // if (hasGroups) {
  //   groupsList = groups.map((groupObj) => <p>{groupObj.group_name}</p>);
  // } else {
  //   groupsList = <div>No groups! Create a group!</div>;
  // }

  return (
    <>
      {!user ? (
        <>Please login</>
      ) : (
        <div className="container">
          {/* <button onClick={() => setCreateGroup(true)}>Create/Join Group</button> */}

          {/* {groupsList} */}
          <Tabs />
        </div>
      )}
    </>
  );
};

export default Friends;
