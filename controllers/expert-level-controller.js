const ExpertLevel = require("../model/expertLevel")


module.exports.getAllExpertLevel = async (req, res) =>{
     try {
        const ExpertLevelData= await ExpertLevel.find()
        res.status(200).json({message:ExpertLevelData})
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}