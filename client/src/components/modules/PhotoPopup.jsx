import { React, useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./PhotoPopup.css";
import CommentsBlock from "./CommentsBlock.jsx";
import { NewComment } from "./NewPostInput.jsx";

const PhotoPopup = (props) => {
  
  const [comments, setComments] = useState([]);
  const [upvotes, setUpvotes] = useState(props.upvotes);
  const [photoId, setPhotoId] = useState("");

  useEffect(() => {
    get("/api/pictureByLink", { link: props.link }).then((photo) => {
      setPhotoId(photo._id);
      get("/api/comment", { parent: photo._id }).then((comments) => {
        setComments(comments);
      });
    });
  }, []);

  const addNewComment = (commentObj) => {
    setComments(comments.concat([commentObj]));
  };

  const [liked, setLiked] = useState(false);

  const handleLikeClick = async () => {
    try {
      setLiked(!liked); // Toggle the like state

      const response = await post("/api/upvote", {
        pictureId: props._id,
        userId: props.userId,
      });

      if (response.message) {
        // If the response contains a message (e.g., user has already upvoted), show an alert
        alert(response.message);
        return;
      }

      // If the upvote was successful, log or display the updated upvote count
      console.log("Upvote successful", response.upvotes);
      setUpvotes(response.upvotes);
    } catch (error) {
      console.error("Error occurred while making the upvote request:", error);
    }
  };

  const handleUnlikeClick = async () => {
    try {
      setLiked(!liked); // Toggle the like state

      const response = await post("/api/un-upvote", {
        pictureId: props._id,
        userId: props.userId,
      });

      if (response.message) {
        // If the response contains a message (e.g., user has already upvoted), show an alert
        alert(response.message);
        return;
      }

      // If the upvote was successful, log or display the updated upvote count
      console.log("Upvote successful", response.upvotes);
      setUpvotes(response.upvotes);
    } catch (error) {
      console.error("Error occurred while making the upvote request:", error);
    }
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
              {props.userId && <NewComment pictureId={photoId} addNewComment={addNewComment} />}{" "}
            </div>
            <div className="upvote">
              {props.userId && (
                <>
                  <div>
                    <span
                      className={`material-icons heart-icon ${liked ? "liked" : ""}`}
                      onClick={!liked ? handleLikeClick : handleUnlikeClick}
                    >
                      {liked ? "favorite" : "favorite_border"}
                    </span>
                  </div>
                  {console.log(upvotes)}
                  <div>{upvotes}</div>
                </>
              )}
            </div>
            {console.log(comments)}

          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoPopup;
