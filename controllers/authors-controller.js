const Authors = require("../model/authors");

module.exports.getAuthor = async (req, res) => {
  try {

    const slug = req.params.id;
    console.log(slug)
    const authorsData = await Authors.findOne({ slug: slug });
    console.log("wwwwwww",authorsData)
    res.status(200).json({
      data: authorsData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    
  }
};

module.exports.getAuthors = async (req, res) => {
  try {
    const authorsData = await Authors.find();
    res.status(200).json({
      data: authorsData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
