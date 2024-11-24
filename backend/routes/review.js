const express = require("express");
const router = express.Router();
const { addReview, getUserOrders } = require("../controllers/review");
const {isVerified, verifyToken } = require("../middleware/auth");

// POST route for adding reviews
router.post("/reviews", isAuthenticated, addReview);
router.get("/orders/user", isVerified, verifyToken, getUserOrders);

module.exports = router;
