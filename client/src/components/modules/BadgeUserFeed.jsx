import { React, useState, useEffect } from "react";
import { get, post } from "../../utilities";

const BadgeUserFeed = () => {
  const [badges, setBadges] = useState([]);
  useEffect(() => {
    get("/api/allUserBadges").then((badgeStored) => {
      setBadges(badgeStored);
    });
  }, []);

  console.log(badges);

  return (
    <>
      {badges.map((badge) => (
        <div>
          <img src={badge.picture} />
          <p>{badge.badge_description}</p>
        </div>
      ))}
    </>
  );
};

export default BadgeUserFeed;
