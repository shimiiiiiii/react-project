const express = require('express');
const router = express.Router();
const { getMonthlySales } = require('../controllers/sales');



// Route for monthly sales data (with date range filter)
router.get('/monthly-sales', getMonthlySales);

module.exports = router;
