import { React, useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import GroupPopup from "../modules/GroupPopup";
import GroupImageFeed from "../modules/GroupImageFeed";
import "./Tabs.css";

const Tabs = () => {
  const { userId } = useContext(UserContext);
  const [groups, setGroups] = useState([]);
  const [createGroup, setCreateGroup] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    refreshGroups();
  }, []);

  const refreshGroups = () => {
    get("/api/group", { userid: userId }).then((groups) => {
      setGroups(groups);
      if (groups) {
        setActiveTab(groups[0]);
      }
    });
  };

  const changeActiveTab = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="Tabs">
      <nav className="tab-nav">
        <ul className="tab-list" role="tablist" aria-orientation="horizontal">
          {groups.map((group) => (
            <li key={group._id}>
              <button
                onClick={() => changeActiveTab(group)}
                aria-selected={activeTab?._id === group._id}
              >
                {group.group_name}
              </button>
            </li>
          ))}
          <li key={"add"}>
            <button onClick={() => setCreateGroup(true)}>+</button>
          </li>
        </ul>
      </nav>
      <GroupImageFeed group={activeTab} />
      <GroupPopup trigger={createGroup} setTrigger={setCreateGroup} refreshGroups={refreshGroups} />
    </div>
  );
};

export default Tabs;
