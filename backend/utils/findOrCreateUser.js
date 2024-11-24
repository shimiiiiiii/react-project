const User = require('../models/user'); // Import your User model

const findOrCreateUser = async (email, displayName) => {
    try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email });
        if (!user) {
            // If not found, create a new user
            user = await User.create({
                email,
                name: displayName,
            });
        }
        return user;
    } catch (err) {
        console.error("Error in findOrCreateUser:", err);
        throw err;
    }
};

module.exports = findOrCreateUser;
