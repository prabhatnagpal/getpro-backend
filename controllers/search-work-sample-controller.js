const Worksample = require('../model/worksample')

module.exports.serarchWorkSample = async (req, res) => {
    try {
        const searchSampleName = req.body.searchSampleName
        const workSampleData = await Worksample.find({title:searchSampleName})
        if(workSampleData.length<1){
            res.status(200).json({
                message: "Work Sample Not Found"
            })
        }else{
            res.status(200).json({
                data: workSampleData
            })
        }
       
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
