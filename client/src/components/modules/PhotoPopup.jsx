import { React, useEffect, useState } from "react";
import { get, post } from "../../utilities";
import { Link } from "react-router-dom";
import "./PhotoPopup.css";

const PhotoPopup = (props) => {
    return (
        <div className="PhotoPopup-container">
            <img className="PhotoPopup-image" src={props.photo} alt="cat" />
        </div>
    );
};