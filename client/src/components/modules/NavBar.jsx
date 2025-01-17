import React from 'react';
import { Link } from "react-router-dom";

import "./NavBar.css";


const NavBar = (props) => {
    return (
        <nav className="NavBar-container">
            <div className="NavBar-linkContainer u-inlineBlock">
                <Link to="/" className="NavBar-link">
                    Home
                </Link>
                {props.userId && (
                    <Link to={`/profile/${props.userId}`} className="NavBar-link u-inlineBlock">
                        Profile
                    </Link>
                )}
                <Link to="/friends/" className="NavBar-link u-inlineBlock">
                    Friends
                </Link>
                <Link to="/badges/" className="NavBar-link u-inlineBlock">
                    Badges
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;