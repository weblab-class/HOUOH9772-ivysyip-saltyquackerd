import { React, useEffect, useState } from "react";
import { get, post } from "../../utilities";
import { Link } from "react-router-dom";
import "./GroupImageFeed.css";
import GroupList from "./GroupList";

const GroupImageFeed = (props) => {
  return (
    <div className="GroupImageFeed">
      {props.group ? <GroupList group={props.group} /> : ""}
      <div className="feed-content"></div>
    </div>
  );
};

export default GroupImageFeed;
