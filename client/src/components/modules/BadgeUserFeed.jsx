import { React, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import SingleBadge from "./SingleBadge";
import Streaks from "./Streaks";
import "./BadgeUserFeed.css";

const BadgeUserFeed = (props) => {
  const [badges, setBadges] = useState([]);
  const [completedBadges, setCompletedBadges] = useState(props.user.badges);
  useEffect(() => {
    get("/api/allUserBadges").then((badgeStored) => {
      setBadges(badgeStored);
    });
  }, []);

  return (
    <div className="badge-feed-container">
      <Streaks
        currentStreak={props.user.currentStreak}
        longestStreak={props.user.highestStreak}
        completedDaily={props.user.completedDaily}
      />

      <div className="badges-list">
        {badges.map((badge) => {
          const isCompleted = completedBadges.includes(badge._id);
          return <SingleBadge key={badge._id} isCompleted={isCompleted} badge={badge} />;
        })}
      </div>
    </div>
  );
};

export default BadgeUserFeed;
