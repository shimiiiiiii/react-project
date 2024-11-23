const mongoose = require('mongoose'); // Import mongoose

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderLine: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true }
        }
    ],
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        country: { type: String, required: true }
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 0.0
    },
    paymentInfo: {
        id: { type: String },
        status: { type: String }
    },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, default: 'Processing' },
    createdAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
