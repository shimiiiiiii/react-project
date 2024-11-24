const Review = require("../models/review");
const Product = require("../models/product");

const addReview = async (req, res) => {
  const { product_id, comment, rating } = req.body;

  try {
    // Check if the product exists
    const productExists = await Product.findById(product_id);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the user already reviewed this product
    const existingReview = await Review.findOne({
      user_id: req.user._id,
      product_id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    // Create a new review
    const review = await Review.create({
      user_id: req.user._id,
      product_id,
      comment,
      rating,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated request

        // Find the orders for the user and populate the orderLine details
        const orders = await Order.find({ user: userId }).populate('orderLine.product');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }

        res.status(200).json({
            success: true,
            orders, // Send populated orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = { addReview };
