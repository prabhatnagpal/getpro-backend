const Blogsample = require('../model/blog')

module.exports.serarchBlog = async (req, res) => {
    try {
        const searchBlogName = req.body.searchBlogName
        const BlogData = await Blogsample.find({title:searchBlogName})
        if(BlogData.length<1){
            res.status(200).json({
                message: "Blog Not Found"
            })
        }else{
            res.status(200).json({
                data: BlogData
            })
        }
       
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}