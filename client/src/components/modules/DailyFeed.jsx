import "./DailyFeed.css";
import React, { useState, useEffect, useMemo } from "react";
import { get } from "../../utilities";
import PhotoPopup from "../modules/PhotoPopup.jsx";
import defaultImage from "../../assets/Default_pfp.jpg"; //CHANGE THIS
import { usePopup } from "../../components/pages/PopupContext.jsx";

const DailyFeed = (props) => {
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [user, setUser] = useState(null);
  const [friendPictures, setFriendPictures] = useState({});


  useEffect(() => {
    if (props.userId) {
      get("/api/group", { userid: props.userId }).then((groups) => setGroups(groups));
    }
  }, [props.userId]);

  useEffect(() => {
    refreshGroups();
  }, []);

  const refreshGroups = () => {
    get("/api/group", { userid: props.userId })
      .then((groups) => {
        // console.log("Fetched groups:", groups);
        setGroups(groups);
      })
      .catch((err) => console.error("Error fetching groups:", err));
  };

  const friendsList = useMemo(() => {
    let friendsList = [];
    if (groups.length > 0) {
      groups.forEach((group) => {
        group.users.forEach((user) => {
          if (!friendsList.some((friend) => friend === user)) {
            friendsList.push(user);
          }
        });
      });
    }
    return friendsList.filter((friend) => friend !== props.userId);
  }, [groups, props.userId]);

  async function getUserNames() {
    try {
      const responses = await Promise.all(
        friendsList.map((userId) => get(`/api/user`, { userid: userId }))
      );
      setFriends(responses.map((friend) => friend.name));
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  }

  useEffect(() => {
    getUserNames();
  }, [friendsList]);

  useEffect(() => {
    if (props.userId !== user?.id) {
      get(`/api/user`, { userid: props.userId }).then((userObj) => {
        setUser(userObj);
        setFriendPictures((prevState) => ({
          ...prevState,
          [props.userId]: userObj.dailyPicture || defaultImage, // default picture if no picture is found
        }));
      });
    }
  }, [props.userId]);

  useEffect(() => {
    if (friendsList.length > 0) {
      const friendsToFetch = friendsList.filter((friend) => !friendPictures[friend]);

      // Use Promise.all to fetch all friend pictures concurrently
      if (friendsToFetch.length > 0) {
        Promise.all(
          friendsToFetch.map((friend) =>
            Promise.all([
              get(`/api/userDailyPicture`, { userid: friend }),
              get(`/api/user`, { userid: friend }),
            ]).then(([dailyPicObj, userObj]) => ({
              [friend]: {
                dailyPicture: dailyPicObj.dailyPicture || "",
                profilePicture: userObj.profilePicture || defaultImage,
              },
            }))
            )
          )
          .then((results) => {
            const updatedPictures = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setFriendPictures((prevState) => ({
              ...prevState,
              ...updatedPictures,
            }));
          })
          .catch((error) => {
            console.error("Failed to fetch daily pictures:", error);
          });
      }
    }
  }, [friendsList]);


  return (
    <div className="daily-feed-container">
      <div className="feed-inner">
        {friendsList.map((friend, index) => (
          <div key={friend}>
            {/* Only render if the picture exists for the friend */}
            {friendPictures[friend]?.dailyPicture && (
              <div className="feed-friend-container">
                <button className="feed-profile-pic" onClick={() => setSelectedFriend(friend)}>
                  <img src={friendPictures[friend]?.profilePicture || defaultImage} alt={friend} />
                </button>
                <div className="feed-profile-name">{friends[index]}</div>
              </div>
            )}

            {/* Popup Overlay */}
            {selectedFriend === friend && (
              <div
                className="feed-popup-overlay"
                style={{ display: selectedFriend ? "block" : "none" }}
                onClick={() => setSelectedFriend(null)}
              >
                <div className="feed-popup-container">
                  <div className="feed-popup">
                    <div className="feed-popup-inner">
                      {/* Passing the friend's picture directly */}
                      <PhotoPopup
                        _id={friendPictures[friend]?.dailyPicture._id}
                        closeModal={() => setSelectedFriend(null)}
                        link={friendPictures[friend]?.dailyPicture} // Correctly passing the link
                        creator_id={friend}
                        userId={props.userId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );


};

export default DailyFeed;
