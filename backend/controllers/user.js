const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register or Create
exports.register = async (req, res, next) => {
    try {
        // const result = await cloudinary.v2.uploader.upload(req.body.photo, {
        //     folder: 'photos',
        //     width: 150,
        //     crop: "scale"
        // });
        
        let result; // insomnia test lng to
        if (req.file) {
             result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'photos',
                width: 150,
                crop: "scale"
            });
        } //end test

        const { name, email, password } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            photo: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });

        // Generate JWT token
        const token = user.getJwtToken();

        return res.status(201).json({
            success: true,
            user,
            token
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
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
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email
        };

        // if (req.body.photo !== '') {
        //     const user = await User.findById(req.user.id);
        //     const image_id = user.photo.public_id;

        //     // Delete old photo from Cloudinary
        //     await cloudinary.v2.uploader.destroy(image_id);

        //     // Upload new photo
        //     const result = await cloudinary.v2.uploader.upload(req.body.photo, {
        //         folder: 'photos',
        //         width: 150,
        //         crop: "scale"
        //     });

        if (req.file) { // insomnia testing only
            const user = await User.findById(req.user.id);
            const image_id = user.photo.public_id;

            // Delete old photo from Cloudinary
            await cloudinary.v2.uploader.destroy(image_id);

            // Upload new photo to Cloudinary
            const result = await cloudinary.v2.uploader.upload(req.file.path, { 
                folder: 'photos',
                width: 150,
                crop: "scale"
            }); //end test

            newUserData.photo = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
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
