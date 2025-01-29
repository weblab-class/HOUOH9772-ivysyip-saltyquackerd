import { React, useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./PhotoPopup.css";
import CommentsBlock from "./CommentsBlock.jsx";
import { NewComment } from "./NewPostInput.jsx";

const PhotoPopup = (props) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    get("/api/comment", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
  }, []);

  const addNewComment = (commentObj) => {
    setComments(comments.concat([commentObj]));
  };


  return (
    <>
      <div className="modal" onClick={props.closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={props.closeModal}>
            x
          </button>
          <div className="modal-image-container">
            <img src={props.link} className="full-image" />
          </div>
          <div className="instagram-comments-container">
            <div className="comments-section">
              <CommentsBlock
                picture={props}
                comments={comments}
                creator_id={props.creator_id}
                userId={props.userId}
                addNewComment={addNewComment}
              />
            </div>
            <div className="new-comment-section">
              {props.userId && <NewComment pictureId={props._id} addNewComment={addNewComment} />}{" "}
            </div>
            {console.log(comments)}
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoPopup;
