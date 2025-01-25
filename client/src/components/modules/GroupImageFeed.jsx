import { React, useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./GroupImageFeed.css";
import GroupList from "./GroupList";
import GroupImages from "./GroupImages";

const GroupImageFeed = (props) => {
  return (
    <div className="GroupImageFeed">
      {props.group ? (
        <>
          <div className="group-content">
            <GroupList group={props.group} refreshGroups={props.refreshGroups} />
          </div>
          <div className="feed-content">
            <GroupImages group={props.group} filteredDate={props.filteredDate} />
          </div>
        </>
      ) : (
        "No groups currently. Join a Group!"
      )}
    </div>
  );
};

export default GroupImageFeed;
