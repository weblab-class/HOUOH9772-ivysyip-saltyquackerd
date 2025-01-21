import React, { useState, useEffect, useContext } from "react";
import { get } from "../../utilities";
import { Link, useParams } from "react-router-dom";

import "../../utilities.css";
import "./Profile.css";

const Profile = () => {
  let props = useParams(); // Retrieve userId from URL parameters
  const [user, setUser] = useState();

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
  }, []);

  const [editing, setEditing] = useState(false);

  const [text, setText] = useState("Bio");

  if (!user) {
    return <div> Loading!</div>;
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
      <div className="u-flex">
        <div className="Profile-subContainer u-textCenter">
          <h4 className="Profile-subTitle">Past Uploads</h4>
        </div>
      </div>
    </>
  );
};

export default Profile;
