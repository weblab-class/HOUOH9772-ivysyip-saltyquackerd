import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { get, post } from "../../utilities";
import Tabs from "../modules/Tabs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Friends.css";

const Friends = () => {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [filteredDate, setFilteredDate] = useState("");

  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
    setFilteredDate(selectedDate.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    setFilteredDate(selectedDate.toISOString().split("T")[0]);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      {!user ? (
        <>Please login</>
      ) : (
        <div className="container">
          <div className="calender-container">
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
          <Tabs />
        </div>
      )}
    </>
  );
};

export default Friends;
