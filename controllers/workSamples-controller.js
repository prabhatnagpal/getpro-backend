const Worksample = require('../model/worksample')

module.exports.getworkSample = async (req, res) => {
    try {
        const workSampleData = await Worksample.find()
        res.status(200).json({
            data: workSampleData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
