const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register or Create
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, dateOfBirth } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a photo' });
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'photos',
            width: 150,
            crop: 'scale',
        });

        const user = await User.create({
            name,
            email,
            password,
            dateOfBirth,
            photo: {
                public_id: result.public_id,
                url: result.secure_url
            },
        });

        const token = user.getJwtToken();

          // Generate verification token
          const verificationToken = user.getVerificationToken();

          // Save the user to persist verification token in the database
          await user.save({ validateBeforeSave: false });
 
          // Create verification URL
          const verificationUrl = `${req.protocol}://${req.get('host')}/api/verify/${verificationToken}`; // Corrected path
          console.log('Sent Verification Token in URL:', verificationToken); // Should match 'Received Verification Token' in the next step
          console.log('Verification URL:', verificationUrl); // Add this line for debugging
          const message = `Please verify your email by clicking on the following link: \n\n${verificationUrl}\n\nIf you did not register, please ignore this email.`;
  
       // Send verification email
       await sendEmail({
         email: user.email,
         subject: 'Email Verification',
         message: 'Please verify your email by clicking on the link below:',
         url: verificationUrl
     });
 
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
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    // Check if a new photo has been uploaded
    if (req.file) {
        // Find the existing user
        const user = await User.findById(req.user.id);
        
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Remove the old photo from Cloudinary if it exists
        if (user.photo.public_id) {
            await cloudinary.v2.uploader.destroy(user.photo.public_id);
        }

        // Upload the new photo to Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'photos',
            width: 150,
            crop: 'scale',
        });

        // Add photo data to newUserData
        newUserData.photo = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }

    // Update the user in the database
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    // Check if the user was updated
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not updated' });
    }

    res.status(200).json({ success: true, user });
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


exports.verifyEmail = async function (req, res) {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ message: "Token is required." });
        }
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log('Received Hashed Token for Verification:', hashedToken);

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};