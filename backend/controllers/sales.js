const Order = require('../models/order');

// Controller for fetching all months' sales
exports.getAllMonthsSales = async (req, res) => {
    try {
        const sales = await Order.aggregate([
            {
                $unwind: '$orderLine'
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, // Group by year-month
                    monthlySales: { $sum: { $multiply: ['$orderLine.price', '$orderLine.quantity'] } } // Total sales for each month
                }
            },
            { $sort: { _id: 1 } } // Sort by month
        ]);

        res.json(sales); // Send the sales data as response
    } catch (error) {
        console.error('Error fetching all months sales:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Controller for fetching monthly sales (with date range)
exports.getMonthlySales = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start and end dates are required' });
    }

    try {
        const sales = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $unwind: '$orderLine'
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // Group by day
                    dailySales: { $sum: { $multiply: ['$orderLine.price', '$orderLine.quantity'] } } // Total sales for each day
                }
            },
            { $sort: { _id: 1 } } // Sort by day
        ]);

        res.json(sales); // Send the sales data as response
    } catch (error) {
        console.error('Error fetching monthly sales:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

