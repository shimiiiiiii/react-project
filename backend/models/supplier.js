const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter supplier name'],
    },
    contactNumber: {
        type: String,
        required: [true, 'Please enter their contact number']
    },
    email: {
        type: String,
        required: [true, 'Please enter their email']
    },
    address: {
        type: String,
        required: [true, 'Please enter their address']
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

module.exports = mongoose.model('Supplier', supplierSchema);
