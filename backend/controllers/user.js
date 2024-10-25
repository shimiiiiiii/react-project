const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register or Create
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, dateOfBirth } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Please upload at least one photo' });
        }

        if (dateOfBirth) {
            req.body.dateOfBirth = new Date(dateOfBirth);
        }

        const imagesLinks = [];

        for (let i = 0; i < req.files.length; i++) {
            const result = await cloudinary.v2.uploader.upload(req.files[i].path, {
                folder: 'photos',
                width: 150,
                crop: 'scale',
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            dateOfBirth,
            photos: imagesLinks,
        });

        const token = user.getJwtToken();

        return res.status(201).json({
            success: true,
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter email & password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        const token = user.getJwtToken();

        return res.status(200).json({
            success: true,
            user,
            token
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get User Profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res, next) => {
//     let user = await User.findById(req.user.id);

//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: 'User not found'
//         });
//     }

//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         dateOfBirth: req.body.dateOfBirth || user.dateOfBirth // Retain old dateOfBirth if not provided
//     };

//     // Handle multiple file uploads for photos
//     let images = [];

//     if (typeof req.body.photos === 'string') {
//         images.push(req.body.photos);
//     } else {
//         images = req.body.photos;
//     }

//     // If there are images, delete old images and upload new ones
//     if (images && images.length > 0) {
//         // Delete old photos from Cloudinary
//         for (let i = 0; i < user.photos.length; i++) {
//             const result = await cloudinary.v2.uploader.destroy(user.photos[i].public_id);
//         }

//         // Upload new photos to Cloudinary
//         let imagesLinks = [];
//         for (let i = 0; i < images.length; i++) {
//             const result = await cloudinary.v2.uploader.upload(images[i], {
//                 folder: 'photos', // Update to your desired folder structure
//                 width: 150,
//                 crop: "scale",
//             });
//             imagesLinks.push({
//                 public_id: result.public_id,
//                 url: result.secure_url
//             });
//         }

//         // Update the user data with new images
//         newUserData.photos = imagesLinks;
//     } else {
//         // If no new images, retain existing ones
//         newUserData.photos = user.photos; 
//     }

//     // Update the user in the database
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
//         new: true,
//         runValidators: true,
//     });

//     if (!updatedUser) {
//         return res.status(401).json({ message: 'User Not Updated' });
//     }

//     return res.status(200).json({
//         success: true,
//         user: updatedUser // Optionally return the updated user
//     });
// };

// Update User Password
exports.updatePassword = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatched = await user.comparePassword(req.body.oldPassword);
        if (!isMatched) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // new password
        user.password = req.body.password;

        await user.save();

        const token = user.getJwtToken();

        return res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
        const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Recovery',
                message
            });

            return res.status(200).json({
                success: true,
                message: `Email sent to: ${user.email}`
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ error: 'Email could not be sent' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        const token = user.getJwtToken();

        return res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get All Users
exports.allUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get User Details
exports.getDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: `User not found with id: ${req.params.id}` });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Update User Role
exports.updateUser = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
