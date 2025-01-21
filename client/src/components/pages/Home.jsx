import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";

import "./Home.css";

const Home = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [seen, setSeen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [uploaded, setUploaded] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [challenge, setChallenge] = useState("wear something blue");

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
  }, []);

  useEffect(() => {
    refreshGroups();
  }, []);

  const refreshGroups = () => {
    get("/api/group", { userid: userId }).then((groups) => setGroups(groups));
  };

  let friendsList = [];
  if (groups !== null) {
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i].users.length; j++) {
        if (friendsList.some((friend) => friend.props.children.trim() === groups[i].users[j])) {
          continue;
        } else {
          friendsList.push(<p key={`${i}-${j}`}>{groups[i].users[j]}</p>);
        }
      }
    }
  }

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
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user_id", userId);
    formData.append("challenge", challenge);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFileUrl(data.fileUrl);
        setUploadMessage("File uploaded successfully!");
      } else {
        const error = await response.json();
        setUploadMessage(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("An error occurred during upload.");
    }
  };

  return (
    <div className="u-homepage">
      {/* Insert below the challenge */}
      <h1 className="feed">
        {!user ? (
          <></>
        ) : (
          <div>
            <button onClick={() => setSeen(true)}></button>
          </div>
        )}
        {friendsList}
      </h1>
      <h1 className="home-title">Today's Challenge</h1>
      <div className="challenge-upload">
        <div className="upload">
          <div className="button_group">
            <form onSubmit={handleSubmit}>
              <label htmlFor="input1">Upload Photo Here</label>
              <input type="file" id="input1" name="filename" onChange={handleUpload} />
              <button type="submit" value="Submit">
                Upload!
              </button>
            </form>
          </div>
          {uploaded && (
            <p style={{ marginTop: "10px", color: "green" }}>Uploaded File: {uploaded}</p>
          )}
          {uploadedFileUrl && (
            <div>
              <p>Uploaded File:</p>
              <img src={uploadedFileUrl} alt="Uploaded file" style={{ width: "300px" }} />
            </div>
          )}
        </div>
      </div>

      <h1 className="challenge">wear something blue</h1>
    </div>
  );
};
export default Home;
