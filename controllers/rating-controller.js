const Rating = require("../model/rating");

module.exports.rating = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const title = req.body.title;
    const description = req.body.description;
    const rating = req.body.rating;
    const ratingData = new Rating({
      username: username,
      email: email,
      title: title,
      description: description,
      rating: rating,
      status: "unread",
    });
    await ratingData.save();
    res.status(200).json({ message: "review submited" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.getAllrating = async (req, res) => {
  try {
    const AllRating = await Rating.find();
    res.status(200).json({ message: AllRating });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
