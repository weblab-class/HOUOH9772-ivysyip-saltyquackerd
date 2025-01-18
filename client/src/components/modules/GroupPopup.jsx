import { React, useState } from "react";
import "./GroupPopup.css";

const GroupPopup = (props) => {
  const [create, setCreate] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleCreate = () => {
    setSelected(true);
    setCreate(true);
  };

  const handleJoin = () => {
    setSelected(true);
  };

  const handleClose = () => {
    setSelected(false);
    setCreate(false);
    props.setTrigger(false);
  };

  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={handleClose}>
          x
        </button>
        {!selected ? (
          <>
            <button onClick={handleCreate}>Create Group</button>
            <button onClick={handleJoin}>Join Group</button>
          </>
        ) : create ? (
          <div>Create Group Content</div>
        ) : (
          <div>Join Group Content</div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default GroupPopup;
