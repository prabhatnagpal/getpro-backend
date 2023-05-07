const ExtraCredit = require("../model/extraCredit")


module.exports.getExtraCredit = async (req, res) =>{
     try {
        let extraCreditData= await ExtraCredit.findOne()
        res.status(200).json({message:extraCreditData})
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}