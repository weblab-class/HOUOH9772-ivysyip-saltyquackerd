const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  dailyPicture: { type: String, default: "" },
  profilePicture: { type: String, default: "Default_pfp.jpg" },
  bio: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
