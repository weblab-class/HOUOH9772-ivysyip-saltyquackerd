const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  dailyPicture: { type: String, default: "" },
  profilePicture: { type: String, default: "Default_pfp.jpg" },
  bio: String,
  currentStreak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  completedDaily: { type: Boolean, default: false },
  upvotesReceived: { type: Number, default: 0 },
  upvotesGiven: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
