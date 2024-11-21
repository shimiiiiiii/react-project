const mongoose = require('mongoose');

const varietySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter variety name'],
    },
    description: {
        type: String,
        required: [true, 'Please enter variety description'],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ]
});

module.exports = mongoose.model('Variety', varietySchema);
