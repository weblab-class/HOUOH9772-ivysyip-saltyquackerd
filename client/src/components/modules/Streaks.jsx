import { React, useState } from "react";

import "./Streaks.css";

const Streaks = (props) => {
  const [daily, setDaily] = useState(props.user.completedDaily);

  return props.user ? (
    <div className="streaks-container">
      <img
        className={daily ? "" : "inactive"}
        src="https://picventurephotos.s3.us-east-2.amazonaws.com/uploads/678994f04058370c73cb3f55/1738128094740_3.png"
      />
      <p>Current streak: {props.user.currentStreak}</p>
      <p>Longest streak: {props.user.highestStreak}</p>
    </div>
  ) : (
    ""
  );
};

export default Streaks;
