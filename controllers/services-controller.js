const Services = require("../model/services")

module.exports.getServices = async (req, res) => {
    try {
        const ServicesData = await Services.find()
        res.status(200).json({
            data: ServicesData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}