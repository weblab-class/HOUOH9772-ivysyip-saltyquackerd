const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  creator_id: String,
  date: String,
  link: String,
  challenge: String,
  upvotes: Number,
});

// compile model from schema
module.exports = mongoose.model("picture", PictureSchema);
