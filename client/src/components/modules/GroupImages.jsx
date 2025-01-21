import { React, useState, useEffect } from "react";
import { get, post } from "../../utilities";

const GroupImages = (props) => {
  const [users, setUsers] = useState([]);
  //   const [filteredPhotos, setFilteredPhotos] = useState([]);

  const photos = [
    {
      user_id: "6789dea16b973c7456b0eb87",
      photo_link:
        "https://www.shutterstock.com/image-vector/cute-cat-pixel-style-260nw-2138544923.jpg",
    },
    {
      user_id: "678b3799d5db88bfcdf111f8",
      photo_link: "https://drive.google.com/uc?id=1N1e-50fnIFhT7_6y_h843yWLIYklY5Ss",
    },
    {
      user_id: "",
      photo_link: "",
    },
  ];

  useEffect(() => {
    setUsers([]);
    if (props.group) {
      props.group.users.forEach((user) => {
        get("/api/user", { userid: user }).then((user) => {
          setUsers((prevUsers) => [...prevUsers, user]);
        });
      });
      //   setFilteredPhotos(photos.filter((photo) => users.some((user) => user._id === photo.user_id)));
    }
  }, [props.group]);
  const filteredPhotos = photos.filter((photo) => users.some((user) => user._id === photo.user_id));
  return (
    <>
      {props.group ? filteredPhotos.map((photo) => <img src={photo.photo_link} alt="Image" />) : ""}
    </>
  );
};

export default GroupImages;
