const Order = require('../models/order');

exports.getMonthlySales = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build filter for optional date range
        const filter = {};
        if (startDate) filter.createdAt = { ...filter.createdAt, $gte: new Date(startDate) };
        if (endDate) {
            // Add end of day to the endDate
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            filter.createdAt = { ...filter.createdAt, $lte: endOfDay };
        }

        // Aggregate sales data by month
        const salesData = await Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalSales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Format response for all months (Jan-Dec)
        const monthlySales = Array(12).fill(0); // Initialize with zeros for each month
        salesData.forEach(({ _id, totalSales }) => {
            monthlySales[_id - 1] = totalSales; // Map sales to correct month (1-based to 0-based)
        });

        res.status(200).json(monthlySales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
