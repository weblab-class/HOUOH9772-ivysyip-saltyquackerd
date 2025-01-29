import React, { useState, useContext, useEffect } from "react";

import "./NewPostInput.css";
import { get, post } from "../../utilities";
import { UserContext } from "../App";

/**
 * New Post is a parent component for all input components
 *
 * Proptypes
 * @param {string} pictureId optional prop, used for comments
 * @param {({pictureId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {pictureId, value} as parameters
 */
const NewPostInput = (props) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  return (
    <div className="u-flex">
      <input
        type="text"
        placeholder="Type a comment..."
        value={value}
        onChange={handleChange}
        className="NewPostInput-input"
      />
      <button
        type="submit"
        className="NewPostInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

/**
 * New Comment is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} pictureId to add comment to
 */
const NewComment = (props) => {
  const { userId } = useContext(UserContext);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userId) {
      get(`/api/user`, { userid: userId }).then((user) => {
        setUserName(user.name);
      });
    }
  }, [userId]);

  const addComment = (value) => {
    const body = {
      parent: props.pictureId,
      content: value,
      creator_id: userId,
      creator_name: userName,
    };
    post("/api/comment", body).then((comment) => {
      // display this comment on the screen
      props.addNewComment(comment);
    });
  };

  return <NewPostInput defaultText="New Comment" onSubmit={addComment} />;
};

export { NewComment };
