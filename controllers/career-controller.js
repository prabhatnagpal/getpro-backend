const Career = require("../model/career")


module.exports.getCareers = async (req, res) =>{
     try {
        const careerData = await Career.find()
        res.status(200).json({
            data: careerData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}