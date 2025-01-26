const Challenge = require("./models/challenge");

async function setDailyChallenge() {
  const today = new Date().toISOString().split("T")[0];

  const todayUTC = new Date();
  const utcDayOfWeek = todayUTC.getUTCDay();

  const categories = [
    "creative",
    "social",
    "academic",
    "professional",
    "cultural",
    "physical",
    "intellectual",
  ];
  const todayCategory = categories[utcDayOfWeek];

  const existingChallenge = await Challenge.findOne({ date: today });

  if (!existingChallenge) {
    const challengeInCategory = await Challenge.findOne({ category: todayCategory, seen: false });

    if (!challengeInCategory) {
      await Challenge.updateMany({}, { $set: { isReady: false, seen: false, date: "" } });

      const challengeInCategory = await Challenge.findOne({ category: todayCategory, seen: false });
      challengeInCategory.seen = true;
      challengeInCategory.date = today;
      challengeInCategory.isReady = true;

      await challengeInCategory.save();
      console.log("New daily challenge set:", challengeInCategory.challenge_text);
    } else {
      challengeInCategory.seen = true;
      challengeInCategory.date = today;
      challengeInCategory.isReady = true;

      await challengeInCategory.save();
      console.log("New daily challenge set:", challengeInCategory.challenge_text);
    }
  }
}

module.exports = setDailyChallenge;
