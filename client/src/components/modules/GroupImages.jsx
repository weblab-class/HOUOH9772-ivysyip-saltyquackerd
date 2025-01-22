import { React, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./GroupImages.css";

const GroupImages = (props) => {
  const [photos, setPhotos] = useState([]);
  //   const [filteredPhotos, setFilteredPhotos] = useState([]);

  useEffect(() => {
    setPhotos([]);
    if (props.group) {
      props.group.users.forEach((user) => {
        get("/api/picturesbyuser", { userid: user }).then((pictures) => {
          setPhotos((prevPhotos) => [...prevPhotos, ...pictures]);
        });
      });
    }
  }, [props.group]);

  return (
    <>
      {props.group
        ? photos.map((photo, index) => <img key={index} src={photo.link} alt="Image" />)
        : ""}
    </>
  );
};

export default GroupImages;
