import React, { useState, useEffect, useContext } from "react";
import { get } from "../../utilities";
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

  const picture1 = {
    creator_id: "678994f04058370c73cb3f55",
    creator_name: "Hailey",
    date: "1/18/2025",
    challenge: "take a picture of a dog",
    link: "https://www.photos-public-domain.com/wp-content/uploads/2012/05/small-dog-with-tongue-sticking-out.jpg",
  };

  const picture2 = {
    creator_id: "678994f04058370c73cb3f55",
    creator_name: "Hailey",
    date: "1/18/2025",
    challenge: "Take a picture of a cat",
    link: "https://www.photos-public-domain.com/wp-content/uploads/2012/05/small-dog-with-tongue-sticking-out.jpg",
  };

  const picture3 = {
    creator_id: "678994f04058370c73cb3f55",
    creator_name: "Hailey",
    date: "1/18/2025",
    challenge: "Take a picture of a bird",
    link: "https://cdn12.picryl.com/photo/2016/12/31/tree-landscape-nature-nature-landscapes-3915df-1024.jpg",
  };

  const picture4 = {
    creator_id: "678994f04058370c73cb3f55",
    creator_name: "Hailey",
    date: "1/18/2025",
    challenge: "Take a picture of a tree",
    link: "https://www.photos-public-domain.com/wp-content/uploads/2012/05/small-dog-with-tongue-sticking-out.jpg",
  };

  const picture5 = {
    creator_id: "678994f04058370c73cb3f55",
    creator_name: "Hailey",
    date: "1/18/2025",
    challenge: "Take a picture of a bird",
    link: "https://cdn12.picryl.com/photo/2016/12/31/tree-landscape-nature-nature-landscapes-3915df-1024.jpg",
  };
  const picture6 = {
    creator_id: "678994f04058370c73cb3f55",
    creator_name: "Hailey",
    date: "1/18/2025",
    challenge: "Take a picture of a bird",
    link: "https://cdn12.picryl.com/photo/2016/12/31/tree-landscape-nature-nature-landscapes-3915df-1024.jpg",
  };
  const picture7 = {
    creator_id: "678994f04058370c73cb3f55",
    creator_name: "Hailey",
    date: "1/18/2025",
    challenge: "Take a picture of a bird",
    link: "https://cdn12.picryl.com/photo/2016/12/31/tree-landscape-nature-nature-landscapes-3915df-1024.jpg",
  };

  let picturesList = [picture1, picture2, picture3, picture4, picture5, picture6, picture7];
  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
    get("/api/picturesbyuser", { userid: props.userId }).then((pictures) => {
      // const filteredImages = pictures.filter((image) => image.creator_id === props.userId);
      // console.log(image.creator_id === props.userId);
      setImages(pictures);
    });
    // setImages(picturesList);
  }, []);

  if (!user) {
    return <div> Loading!</div>;
  }

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
      <button onClick={togglePopup}>Open Popup</button>

      <Popup open={isOpen} isOpen={togglePopup}>
        <div>
          <h2>Popup Content</h2>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
          {/* <button onClick={updateBio}>Save</button> */}
          <button onClick={togglePopup}>Close</button>
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
