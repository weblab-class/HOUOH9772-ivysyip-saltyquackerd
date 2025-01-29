import React, { useState, useEffect, useContext, useMemo } from "react";
import { get, post } from "../../utilities";
import { Link, useParams } from "react-router-dom";
import Picture from "../modules/Picture";
import "../../utilities.css";
import "./Profile.css";
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
  const [uploaded, setUploaded] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

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
      get("/api/uploadProfilePicture", { userid: props.userId }).then(() => {});
    }
  }, [props.userId, props.profilePicture]);

  const showEditButton = useMemo(() => String(userId) === props.userId, [userId, props.userId]);

  const updateBio = () => {
    post("/api/bio", { userId: props.userId, bio: bio }).then(() => {});
  };

  const handleSave = () => {
    updateBio();
    togglePopup();
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploaded(file.name);
      setSelectedFile(event.target.files[0]);
    } else {
      setUploaded(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      // setUploadMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user_id", userId);

    try {
      const response = await fetch("/api/uploadProfilePicture", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFileUrl(data.fileUrl);
        // setUploadMessage("File uploaded successfully!");
      } else {
        const error = await response.json();
        // setUploadMessage(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // setUploadMessage("An error occurred during upload.");
    }
  };

  if (!user) {
    return <div> Loading!</div>;
  }

  let picturesList = [];
  if (images && images.length !== 0) {
    const sortedImages = images.sort((a, b) => new Date(b.date) - new Date(a.date));

    picturesList = (
      <div className="picture-grid">
        {/* Add the grid container here */}
        {sortedImages.map((image, index) => (
          <Picture
            key={`Picture_${index}`}
            // creator_name={image.creator_name}
            creator_id={image.creator_id}
            _id={image._id}
            date={image.date}
            challenge={image.challenge}
            link={image.link}
            userId={userId}
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
        <div className="Profile-avatarCenter">
          <div className="Profile-avatarContainer">
            <img classname="Profile-avatar" src={user.profilePicture} />
          </div>
        </div>
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
        <div className="upload">
          {uploaded ? (
            <>
              <div className="button_group">
                <form onSubmit={handleSubmit}>
                  {uploadedFileUrl ? null : (
                    <button type="submit" value="Submit">
                      Upload!
                    </button>
                  )}
                </form>
              </div>
              {uploadedFileUrl && (
                <div>
                  <img
                    id="photo"
                    src={uploadedFileUrl}
                    alt="Uploaded file"
                    style={{ width: "300px" }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="button_group">
              <form onSubmit={handleSubmit}>
                <label htmlFor="input1">Upload Photo Here</label>
                <input
                  type="file"
                  id="input1"
                  name="filename"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </form>
            </div>
          )}
        </div>
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
