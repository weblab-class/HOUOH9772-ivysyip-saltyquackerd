import React, { useState, useEffect, useContext } from "react";
import { get, post } from "../../utilities";
import { Link, useParams } from "react-router-dom";
import Picture from "../modules/Picture";
import "../../utilities.css";
import "./Profile.css";
import EditPage from "./EditPage.jsx";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const Profile = () => {
  let props = useParams();
  const [user, setUser] = useState();
  const [images, setImages] = useState([]);
  const [bio, setBio] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => {
      setUser(userObj);
      setBio(userObj.bio);
    });
    get("/api/picturesbyuser", { userid: props.userId }).then((pictures) => {
      // const filteredImages = pictures.filter((image) => image.creator_id === props.userId);
      // console.log(image.creator_id === props.userId);
      setImages(pictures);
    });
  }, []);

  // async function fetchBio() {
  //   try {
  //     const response = await fetch("/api/bio");
  //     if (response.ok) {
  //       const data = await response.json();
  //       return data.groupCode;
  //     } else {
  //       throw new Error("Failed to fetch bio");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  const updateBio = () => {
    post("/api/bio", { userId: props.userId, bio: bio }).then(() => {});
  };

  if (!user) {
    return <div> Loading!</div>;
  }

  let picturesList = [];
  // console.log(images);
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
      <div>
        <div className="Profile-avatar" />
      </div>
      <h1 className="Profile-name u-textCenter">{user.name}</h1>
      <h4 className="Profile-bio u-textCenter">{bio}</h4>
      <button className="Profile-edit-button" onClick={togglePopup}>
        Edit Profile
      </button>

      <Popup open={isOpen} isOpen={togglePopup}>
        <div>
          <h2>Update Profile</h2>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
          <button className="Profile-popup-button" onClick={updateBio}>
            Save
          </button>
          <button className="Profile-popup-button" onClick={togglePopup}>
            Close
          </button>
        </div>
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
