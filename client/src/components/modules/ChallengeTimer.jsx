import React, { useState, useEffect } from "react";
import { get } from "../../utilities.js";

const ChallengeTimer = (props) => {
  const [utcDate, setUTCDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [countdown, setCountdown] = useState("");
  const [challenge, setChallenge] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      const todayUTC = new Date().toISOString().split("T")[0];
      setUTCDate(todayUTC);

      const pollForChallenge = async () => {
        try {
          const response = await get("/api/challenge", { date: todayUTC });

          if (response.isReady) {
            setChallenge(response.challenge_text);
            props.setPhotoChallenge(response.challenge_text);
          } else {
            setTimeout(pollForChallenge, 5000); // Retry every 5 seconds
          }
        } catch (err) {
          if (err.response && err.response.status === 202) {
            setTimeout(pollForChallenge, 5000); // Retry every 5 seconds
          } else {
            console.error("Error fetching challenge:", err);
            setChallenge("Failed to load challenge.");
            props.setPhotoChallenge(response.challenge_text);
          }
        }
      };

      pollForChallenge();
    };

    const calculateCountdown = () => {
      const now = new Date();
      const nextUTCMidnight = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
      );
      const timeUntilUTCMidnight = nextUTCMidnight - now;

      const hours = Math.floor(timeUntilUTCMidnight / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilUTCMidnight % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeUntilUTCMidnight % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    fetchChallenge();
    calculateCountdown();

    const countdownInterval = setInterval(() => {
      calculateCountdown();
    }, 1000);

    const now = new Date();
    const nextUTCMidnight = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
    );
    const timeUntilUTCMidnight = nextUTCMidnight - now;

    const midnightTimeout = setTimeout(() => {
      fetchChallenge();
      calculateCountdown();
    }, timeUntilUTCMidnight);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(midnightTimeout);
    };
  }, []);

  return (
    <div>
      <h2>
        {challenge} ({utcDate})
      </h2>
      <p>Time until next challenge: {countdown}</p>
    </div>
  );
};

export default ChallengeTimer;
