import { React, useState } from "react";
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
  const [isModalOpen, setModalOpen] = useState(false);

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="Picture-container">
      <div className="picture-item" onClick={handleImageClick}>
        <img src={props.link} alt={props.challenge} className="picture-img" />
        <div className="picture-info">
          <p>
            {props.challenge} {props.date}
          </p>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              x
            </button>
            <div className="modal-image-container">
              <img src={props.link} className="full-image" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Picture;
