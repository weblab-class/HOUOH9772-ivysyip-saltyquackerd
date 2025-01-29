import { React, useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import Streaks from "../modules/Streaks";
import BadgeUserFeed from "../modules/BadgeUserFeed";

const Badges = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);

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
        <>
          <Streaks user={user} /> <BadgeUserFeed user={user} />
        </>
      )}{" "}
    </>
  );
};

export default Badges;
