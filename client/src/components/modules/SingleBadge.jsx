import { React } from "react";
import "./SingleBadge.css";

const SingleBadge = (props) => {
  return (
    <div
      key={props.badge._id}
      className={`badge-container ${props.isCompleted ? "completed-badge" : "incomplete-badge"}`}
    >
      <img src={props.badge.picture} />
      <p>{props.badge.badge_description}</p>
    </div>
  );
};

export default SingleBadge;
