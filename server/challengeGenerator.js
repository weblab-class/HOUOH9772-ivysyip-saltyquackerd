const Challenge = require("./models/challenge");

const challenges = [
  "Do 50 push-ups",
  "Read for 20 minutes",
  "Drink 8 glasses of water",
  "Write a poem",
];

function getRandomChallenge() {
  return challenges[Math.floor(Math.random() * challenges.length)];
}

async function setDailyChallenge() {
  const today = new Date().toISOString().split("T")[0];

  const existingChallenge = await Challenge.findOne({ date: today });
  if (!existingChallenge) {
    const newChallenge = new Challenge({
      challenge_text: getRandomChallenge(),
      category: "test",
      seen: false,
      date: today,
    });
    await newChallenge.save();
    console.log("New daily challenge set:", newChallenge.challenge);
  }
}

module.exports = setDailyChallenge;
