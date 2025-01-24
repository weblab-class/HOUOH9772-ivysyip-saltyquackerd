import React, { useState, useEffect } from "react";
import { get } from "../../utilities.js";

const ChallengeTimer = () => {
  const [utcDate, setUTCDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [countdown, setCountdown] = useState("");
  const [challenge, setChallenge] = useState("");
  const categories = [
    "social",
    "fashion",
    "academic",
    "creative",
    "professional",
    "culture",
    "physical",
  ];

  useEffect(() => {
    const fetchChallenge = () => {
      const todayUTC = new Date().toISOString().split("T")[0];
      setUTCDate(todayUTC);

      get("/api/challenge", { date: todayUTC })
        .then((challenge) => {
          console.log(challenge.challenge_text);
          setChallenge(challenge.challenge_text);
        })
        .catch((err) => {
          console.error("Error fetching challenge:", err);
          setChallenge("Failed to load challenge.");
        });
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
