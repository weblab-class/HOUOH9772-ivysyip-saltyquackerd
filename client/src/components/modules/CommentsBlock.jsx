import React from "react";
import SingleComment from "./SingleComment";
import { NewComment } from "./NewPostInput";

/**
 * @typedef ContentObject
 * @property {string} _id of picture/comment
 * @property {string} creator_name
 * @property {string} content of the picture/comment
 */

/**
 * Component that holds all the comments for a picture
 *
 * Proptypes
 * @param {ContentObject[]} comments
 * @param {ContentObject} picture
 */
const CommentsBlock = (props) => {
  return (
    <div>
      <div className="CommentsBlock-content">
        {props.comments.map((comment) => (
          <SingleComment
            key={`SingleComment_${comment._id}`}
            _id={comment._id}
            creator_name={comment.creator_name}
            creator_id={comment.creator_id}
            content={comment.content}
          />
        ))}
        {/* {props.userId && <NewComment pictureId={props._id} addNewComment={props.addNewComment} />} */}
      </div>
    </div>
  );
};

export default CommentsBlock;
