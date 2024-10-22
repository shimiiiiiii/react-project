const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        maxLength: 45,
        required: true
    },
    answer: {
        type: String,
        maxLength: 45,
        required: true
    },
    imgPath: {
         public_id: {
            type: String,
            // required: true
        },
        url: {
            type: String,
            // required: true
        }
    }
});

module.exports = mongoose.model('FAQ', faqSchema);



