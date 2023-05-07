const faqsRouter = require('express').Router()
const faqsController = require("../controllers/faqs-controller")


faqsRouter
    .route('/getFaqs')
    .get(faqsController.getFaqs);

module.exports=faqsRouter