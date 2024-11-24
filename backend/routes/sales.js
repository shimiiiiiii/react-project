const express = require('express');
const router = express.Router();
const { getAllMonthsSales, getMonthlySales } = require('../controllers/sales');

// Route for all-months sales data
router.get('/all-months-sales', getAllMonthsSales);

// Route for monthly sales data (with date range filter)
router.get('/monthly-sales', getMonthlySales);

module.exports = router;
