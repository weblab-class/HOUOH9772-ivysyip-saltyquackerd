import { React, useEffect, useState } from "react";
import { get, post } from "../../utilities";
import { Link } from "react-router-dom";
import "./PhotoPopup.css";
import CommentsBlock from "./CommentsBlock.jsx";
import { NewComment } from "./NewPostInput.jsx";
import "./CommentSection.css";

const CommentSection = (props) => {
  const [comments, setComments] = useState([]);

  //   useEffect(() => {
  //     get("/api/comment", { parent: props._id }).then((comments) => {
  //       setComments(comments);
  //     });
  //   }, []);

  const fetchComments = () => {
    get("/api/comment", { parent: props._id }).then((fetchedComments) => {
      setComments(fetchedComments); // Update state with fetched comments
    });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addNewComment = (commentObj) => {
    setComments((prevComments) => [...prevComments, commentObj]);

    post("/api/comment", commentObj).then(() => {
      fetchComments(); // Ensure new comments are properly stored & displayed
    });
  };

  return (
    <div className="instagram-comments-container">
      <div className="comments-section">
        <CommentsBlock
          picture={props.picture}
          comments={comments}
          creator_id={props.creator_id}
          addNewComment={addNewComment}
        />
      </div>
      <div className="new-comment-section">
        {props.userId && <NewComment pictureId={props._id} addNewComment={addNewComment} />}{" "}
      </div>
      {console.log(comments)}
    </div>
  );
};

export default CommentSection;
