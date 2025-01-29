import { React, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import SingleBadge from "./SingleBadge";
import Streaks from "./Streaks";

const BadgeGroupFeed = (props) => {
  const [badges, setBadges] = useState([]);
  const [group, setGroup] = useState(null);
  const [completedBadges, setCompletedBadges] = useState([]);

  useEffect(() => {
    get("/api/allGroupBadges").then((badgeStored) => {
      setBadges(badgeStored);
    });
    get("/api/groupById", { groupId: props.group }).then((group) => {
      setGroup(group);
      setCompletedBadges(group.badges);
    });
  }, [props.group]);

  return (
    <div className="badge-feed-container">
      {group && (
        <Streaks
          currentStreak={group.currentStreak}
          longestStreak={group.longestStreak}
          completedDaily={group.completedDaily}
        />
      )}
      <div className="badges-list">
        {badges.map((badge) => {
          const isCompleted = completedBadges.includes(badge._id);
          return <SingleBadge key={badge._id} isCompleted={isCompleted} badge={badge} />;
        })}
      </div>
    </div>
  );
};

export default BadgeGroupFeed;
