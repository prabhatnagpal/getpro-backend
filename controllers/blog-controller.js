const Blog = require("../model/blog");

module.exports.readMoreBlog = async (req, res) => {
  try {
    const slug = req.params.id;
    console.log(slug);
    const BlogData = await Blog.findOne({ slug: slug });
    res.status(200).json({
      data: BlogData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.getBlog = async (req, res) => {
  try {
    const blogData = await Blog.find();
    res.status(200).json({
      data: blogData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
