const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path to your User model

const isVerified = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: 'User is not verified' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// module.exports = (req, res, next) => {
//     if (!req.user || !req.user.isVerified) {
//         return res.status(401).json({ success: false, message: 'User not verified' });
//     }
//     next(); // Proceed to the next middleware/route handler
// };


module.exports = isVerified;