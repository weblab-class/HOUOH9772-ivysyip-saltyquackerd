import React, { useState, useEffect, useContext } from "react";
import { get } from "../../utilities";
import { Link, useParams } from "react-router-dom";
import Picture from "../modules/Picture";
import "../../utilities.css";
import "./Profile.css";

const Profile = () => {
  let props = useParams(); // Retrieve userId from URL parameters
  const [user, setUser] = useState();
  const [images, setImages] = useState([]);

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
  //     <div className="picture-grid" key={`picture_${index}`}>

  // console.log(images);
  if (images && images.length !== 0) {
    picturesList = (
      <div className="picture-grid">
        {" "}
        {/* Add the grid container here */}
        {images.map((image, index) => (
          <Picture
            // className="picture-item"
            key={`Picture_${index}`} // Add a unique key to each item
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
      <h4 className="Profile-bio u-textCenter">bio</h4>
      <button className="Profile-edit-button">
        <Link to={`/accounts/edit/${props.userId}`}>Edit Profile</Link>
      </button>

      {/* <div className="Profile-bio u-textCenter">
        {editing ? (
          <>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button type="button" class="Profile-edit-button" onClick={() => setEditing(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-edit"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                <path d="M16 5l3 3" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <span>{text}</span>
            <button type="button" class="Profile-edit-button" onClick={() => setEditing(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-edit"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                <path d="M16 5l3 3" />
              </svg>
            </button>
          </>
        )}
      </div> */}
      <div>
        <div>
          <h4 className="Profile-subTitle">Past Uploads</h4>
          <hr className="Profile-line" />
        </div>
        {picturesList}
      </div>
    </>
  );
};

export default Profile;
