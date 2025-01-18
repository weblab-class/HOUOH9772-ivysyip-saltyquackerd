const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  profilePicture: { type: String, default: "Default_pfp.jpg" }, // URL or path to the image
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
