import React from "react";
import { Link } from "react-router-dom";
import "./SingleComment.css";

/**
 * Component to render a single comment
 *
 * Proptypes
 * @param {string} _id of comment
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the comment
 */
const SingleComment = (props) => {
  return (
    <div className="SingleComment">
      <Link className="SingleComment-username" to={`/profile/${props.creator_id}`}>
        {props.creator_name}
      </Link>
      <span className="SingleComment-content">{props.content}</span>
    </div>
  );
};

export default SingleComment;
