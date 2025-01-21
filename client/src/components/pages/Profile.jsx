import React, { useState, useEffect, useContext } from "react";
import { get } from "../../utilities";
import { Link, useParams } from "react-router-dom";

import "../../utilities.css";
import "./Profile.css";

const Profile = () => {
  let props = useParams(); // Retrieve userId from URL parameters
  const [user, setUser] = useState();

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
  }, []);

  const [editing, setEditing] = useState(false);

  const [text, setText] = useState("Bio");

  if (!user) {
    return <div> Loading!</div>;
  }
  return (
    <>
      <div>
        <div className="Profile-avatar" />
      </div>
      <h1 className="Profile-name u-textCenter">Minini World</h1>
      <h4 className="Profile-bio u-textCenter">bio</h4>
      <div className="u-flex">
        <div className="Profile-subContainer u-textCenter">
          <h4 className="Profile-subTitle">Past Uploads</h4>
        </div>
      </div>
    </>
  );
};

export default Profile;
