import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import Tabs from "../modules/Tabs";
import "./Friends.css";

import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

const Friends = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);

  const getUTCDate = () => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  };

  const [value, setValue] = useState(getUTCDate());
  const [filteredDate, setFilteredDate] = useState("");

  const tileClassName = ({ date, view }) => {
    const utcDate = getUTCDate();
    if (
      view === "month" &&
      date.getUTCFullYear() === utcDate.getUTCFullYear() &&
      date.getUTCMonth() === utcDate.getUTCMonth() &&
      date.getUTCDate() === utcDate.getUTCDate()
    ) {
      return "react-calendar__tile--utc-now";
    }
    return null;
  };

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
    setFilteredDate(value.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    setFilteredDate(value.toISOString().split("T")[0]);
  }, [value]);

  return (
    <>
      {!user ? (
        <>Please login</>
      ) : (
        <div className="container">
          <div className="calender-container">
            <Calendar
              value={value}
              onChange={setValue}
              tileClassName={tileClassName} // Add custom class logic
            />
          </div>
          <Tabs filteredDate={filteredDate} />
        </div>
      )}
    </>
  );
};

export default Friends;
