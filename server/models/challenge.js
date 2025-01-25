const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  challenge_text: String,
  category: String,
  seen: Boolean,
  date: String,
  isReady: Boolean,
});

module.exports = mongoose.model("challenge", ChallengeSchema);
