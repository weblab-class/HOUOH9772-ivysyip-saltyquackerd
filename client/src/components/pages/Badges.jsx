import { React, useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import Streaks from "../modules/Streaks";
import BadgeUserFeed from "../modules/BadgeUserFeed";
import BadgeGroupSelector from "../modules/BadgeGroupSelector";
import "./Badges.css";

const Badges = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
  }, []);

  return (
    <>
      {!user ? (
        <>Please login</>
      ) : (
        <div className="badges-page">
          {/* Tabs Section */}
          <div className="tabs-container">
            <button
              className={activeTab === "personal" ? "tab active-tab" : "tab"}
              onClick={() => setActiveTab("personal")}
            >
              Personal
            </button>
            <button
              className={activeTab === "groups" ? "tab active-tab" : "tab"}
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </button>
          </div>

          {/* Conditionally Render Streaks or Badges */}
          <div className="tab-content">
            {activeTab === "personal" ? (
              <>
                <BadgeUserFeed user={user} />
              </>
            ) : (
              <BadgeGroupSelector user={user} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Badges;
