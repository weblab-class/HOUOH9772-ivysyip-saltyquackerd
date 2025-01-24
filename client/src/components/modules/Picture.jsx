import React from "react";
import { Link } from "react-router-dom";
import "./Picture.css";

/**
 * Picture is a component that renders the challenge, date and picture
 *
 * Proptypes
 * @param {string} _id of the picture
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} date of the picture
 * @param {string} link of the picture
 * @param {string} challenge associated with the picture
 */
const Picture = (props) => {
  return (
    <div className="picture-item">
      <img src={props.link} alt={props.challenge} className="picture-img" />
      <div className="picture-info">
        <p>
          {props.challenge} {props.date}
        </p>
      </div>
    </div>
  );
};

export default Picture;
