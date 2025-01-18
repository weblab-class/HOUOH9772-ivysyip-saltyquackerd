import React, { useState, useEffect, useContext } from "react";
import { get } from "../../utilities";
import { Link, useParams } from "react-router-dom";

import "../../utilities.css";
import "./EditPage.css";

const EditPage = () => {
  let props = useParams(); // Retrieve userId from URL parameters
  const [user, setUser] = useState();

  useEffect(() => {
    document.title = "Edit Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
  }, []);

  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(value);
    }
  };

  if (!user) {
    return <div> Loading!</div>;
  }
  return (
    <>
      <div className="EditPage-maintitle">Edit Profile</div>
      <div className="EditPage-profilepicture">
        <h4 className="EditPage-profilename">{user.name}</h4>
      </div>
      <div className="EditPage-title">Bio</div>
      <div>
        <textarea
          className="EditPage-bio"
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Edit your bio"
          maxLength={150}
          name="Text1"
          cols="20"
          rows="3"
        ></textarea>
      </div>
    </>
  );
};

export default EditPage;
