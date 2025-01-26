import { React, useEffect, useState } from "react";
import "./PhotoPopup.css";

const PhotoPopup = (props) => {
    return (
        <div className="PhotoPopup-container">
            <img className="PhotoPopup-image" src={props.photo} alt="cat" />
        </div>
    );
};
export default PhotoPopup;