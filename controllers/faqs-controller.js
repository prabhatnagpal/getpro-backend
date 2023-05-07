const Faqs = require('../model/faqs')

module.exports.getFaqs = async (req, res) => {
    try {
        const faqsData = await Faqs.find()
        res.status(200).json({
            data: faqsData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}