import { React, useState, useContext } from "react";
import { get, post } from "../../utilities";
import { UserContext } from "../App";
import "./EditPage.css";

const EditPage = (props) => {
  const { userId } = useContext(UserContext);
  const [selected, setSelected] = useState(false);
  const [bio, setBio] = useState("");

  const handleEdit = () => {
    setSelected(true);
  };

  const handleClose = () => {
    setSelected(false);
    props.setEditing(false);
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={handleClose}>
          x
        </button>
        <button onClick={handleEdit}>Edit Bio</button>
      </div>
    </div>
  );
};

export default EditPage;
