import React, { useState, useEffect, useContext, useMemo } from "react";
import { get, post } from "../../utilities";
import { Link, useParams } from "react-router-dom";
import Picture from "../modules/Picture";
import "../../utilities.css";
import "./Profile.css";
import EditPage from "./EditPage.jsx";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { UserContext } from "../App.jsx";

const Profile = () => {
  let props = useParams();
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState();
  const [images, setImages] = useState([]);
  const [bio, setBio] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.title = "Profile Page";
    if (props.userId !== user?.id) {
      get(`/api/user`, { userid: props.userId }).then((userObj) => {
        setUser(userObj);
        setBio(userObj.bio);
      });
      get("/api/picturesbyuser", { userid: props.userId }).then((pictures) => {
        setImages(pictures);
      });
    }
  }, [props.userId]);

  const showEditButton = useMemo(() => String(userId) === props.userId, [userId, props.userId]);

  const updateBio = () => {
    post("/api/bio", { userId: props.userId, bio: bio }).then(() => {});
  };

  const handleSave = () => {
    updateBio();
    togglePopup();
  };

  if (!user) {
    return <div> Loading!</div>;
  }

  let picturesList = [];
  if (images && images.length !== 0) {
    picturesList = (
      <div className="picture-grid">
        {" "}
        {/* Add the grid container here */}
        {images.map((image, index) => (
          <Picture
            key={`Picture_${index}`}
            creator_name={image.creator_name}
            // creator_id={image.creator_id}
            date={image.date}
            challenge={image.challenge}
            link={image.link}
          />
        ))}
      </div>
    );
  } else {
    picturesList = <div>No pictures!</div>;
  }
  return (
    <>
      <div class="Profile-avatarContainer">
        <div className="Profile-avatar" />
        <h1 className="Profile-name u-textCenter">{user.name}</h1>
        <h4 className="Profile-bio u-textCenter">{bio}</h4>
        {showEditButton && (
          <div className="Profile-edit">
            <button className="Profile-edit-button" onClick={togglePopup}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
      <Popup open={isOpen} isOpen={togglePopup} className="Profile-popup">
        <h2 className="Profile-popup-header">Update Profile</h2>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio..."
          maxLength={150}
          className="Profile-textarea"
        />
        <div className="Profile-popup-counter">{bio ? bio.length : 0} / 150</div>
        <button className="Profile-popup-button-save" onClick={handleSave}>
          Save
        </button>
        <button className="Profile-popup-button-close" onClick={togglePopup}>
          Close
        </button>
      </Popup>
      <div>
        <div>
          <h4 className="Profile-subTitle">Past Uploads</h4>
        </div>
        {picturesList}
      </div>
    </>
  );
};

export default Profile;
