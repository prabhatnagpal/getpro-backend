const ContentType = require("../model/contentType")


module.exports.getAllExpertLevel = async (req, res) =>{
     try {
        const ContentTypeData= await ContentType.find()
        res.status(200).json({message:ContentTypeData})
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}