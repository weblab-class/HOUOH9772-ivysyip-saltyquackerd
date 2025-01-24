import { React, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./GroupImages.css";

const GroupImages = (props) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    setPhotos([]);
    if (props.group) {
      props.group.users.forEach((user) => {
        get("/api/picturesByUserAndDate", { userid: user, date: props.filteredDate }).then(
          (pictures) => {
            setPhotos((prevPhotos) => [...prevPhotos, ...pictures]);
          }
        );
      });
    }
  }, [props.group, props.filteredDate]);

  return (
    <>
      {props.group ? (
        <>
          {photos.length !== 0
            ? photos.map((photo, index) => <img key={index} src={photo.link} alt="Image" />)
            : "No photos for this day"}
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default GroupImages;
