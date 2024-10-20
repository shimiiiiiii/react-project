const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter donut name'],
        trim: true,
        maxLength: [50, 'Product name should not exceed 50 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter price'],
        maxLength: [4, 'Price must not exceed in 4 digits'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter donut description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                // required: true
            },
            url: {
                type: String,
                // required: true
            },
        }
    ],
    variety: {
        type: String,
        required: [true, 'Please select donut variety'],
        enum: ['Classic', 'Premium', 'Supreme', 'Munchkins', 'Other']
    },
    supplier: {
        type: mongoose.Schema.ObjectId,
        ref: 'Supplier',
        required: [true, 'Please select a supplier']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [100, 'Stock cannot exceed 100'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    // reviews: [
    //     {
    //         user: {
    //             type: mongoose.Schema.ObjectId,
    //             ref: 'User',
    //             required: true
    //         },
    //         name: {
    //             type: String,
    //             required: true
    //         },
    //         rating: {
    //             type: Number,
    //             required: true
    //         },
    //         comment: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
