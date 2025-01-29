import { React, useState, useEffect, useContext } from "react";
import { get, post } from "../../utilities";
import "./GroupImages.css";
import PhotoPopup from "./PhotoPopup";
import { UserContext } from "../App";

const GroupImages = (props) => {
  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { userId } = useContext(UserContext);

  const handleImageClick = (index) => {
    setSelectedPhoto(photos[index]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setModalOpen(false);
  };

  useEffect(() => {
    setPhotos([]); // Clear photos when group or date changes
    if (props.group) {
      props.group.users.forEach((userId) => {
        get("/api/picturesByUserAndDate", { userid: userId, date: props.filteredDate }).then(
          (pictures) => {
            setPhotos((prevPhotos) => {
              // Filter out duplicates before updating state
              const newPhotos = pictures.filter(
                (newPic) => !prevPhotos.some((existingPic) => existingPic._id === newPic._id)
              );
              return [...prevPhotos, ...newPhotos];
            });
          }
        );
      });
    }
  }, [props.group, props.filteredDate]);

  console.log(selectedPhoto);

  return (
    <>
      {props.group ? (
        <>
          {photos.length !== 0
            ? photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.link}
                  className={"photo"}
                  onClick={() => handleImageClick(index)}
                  alt="Image"
                />
              ))
            : "No photos for this day"}
          {isModalOpen && (
            <PhotoPopup
              closeModal={closeModal}
              link={selectedPhoto.link}
              _id={selectedPhoto._id}
              creator_id={selectedPhoto.creator_id}
              userId={userId}
            />
          )}
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default GroupImages;
