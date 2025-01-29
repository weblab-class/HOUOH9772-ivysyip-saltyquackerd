import { React, useEffect } from "react";

const Streaks = (props) => {
  console.log(props.user);
  return props.user ? (
    <>
      <p>Current streak: {props.user.currentStreak}</p>
      <p>Longest streak: {props.user.highestStreak}</p>
    </>
  ) : (
    ""
  );
};

export default Streaks;
