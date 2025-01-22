import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get } from "../../utilities";

import "./Home.css";

import DailyFeed from "../modules/DailyFeed";

const Home = () => {
  const { userId } = useContext(UserContext);
  const [uploaded, setUploaded] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [challenge, setChallenge] = useState("wear something blue");

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
  }, []);
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
      <DailyFeed />
      <h1 className="home-title">Today's Challenge</h1>
      <div className="challenge-upload">
        <div className="upload">
          {uploaded ? (
            <>
              <div className="button_group">
                <form onSubmit={handleSubmit}>
                  <input type="file" id="input1" name="filename" onChange={handleUpload} />
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
                <input type="file" id="input1" name="filename" onChange={handleUpload} />
              </form>
            </div>
          )}
        </div>
      </div>
      <h1 className="challenge">wear something blue</h1>
    </div>
  );
};
export default Home;
