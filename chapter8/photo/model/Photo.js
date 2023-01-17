const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1/photo_app");

const schema = new mongoose.Schema({
  name: String,
  path: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

// Compile model from schema
module.exports = mongoose.model("Photo", schema);
