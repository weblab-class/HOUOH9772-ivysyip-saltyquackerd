import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import GroupPopup from "../modules/GroupPopup";

const Friends = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [createGroup, setCreateGroup] = useState(false);

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
  }, []);

  useEffect(() => {
    refreshGroups();
  }, []);

  const refreshGroups = () => {
    get("/api/group", { userid: userId }).then((groups) => setGroups(groups));
  };

  let groupsList = null;
  const hasGroups = groups.length !== 0;
  if (hasGroups) {
    groupsList = groups.map((groupObj) => <p>{groupObj.group_name}</p>);
  } else {
    groupsList = <div>No groups! Create a group!</div>;
  }

  return (
    <>
      {!user ? (
        <>Please login</>
      ) : (
        <div>
          <button onClick={() => setCreateGroup(true)}>Create/Join Group</button>
          <GroupPopup
            trigger={createGroup}
            setTrigger={setCreateGroup}
            refreshGroups={refreshGroups}
          />
          {groupsList}
        </div>
      )}
    </>
  );
};

export default Friends;
