const mongoose = require("mongoose");
const Blog = mongoose.Schema({
  title: String,
  name: String,
  dec: String,
  image: String,
  date: String,
  slug: String,
});

module.exports = mongoose.model("Blog", Blog);
