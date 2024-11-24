const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const sendEmail = require('../utils/sendEmail');
const jwt = require("jsonwebtoken");
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

exports.getMe = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is missing' });
        }

        // Decode the token to get the user ID (assuming the token contains user id and name)
        const decoded = jwt.decode(token); // Decodes the token without verifying the signature (if you don't need to verify it)

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        const { id, name } = decoded; // Extract user ID and name from decoded token

        // Retrieve the user details from the database
        const user = await User.findById(id).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Respond with user data
        res.status(200).json({ success: true, user: { id, name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available via middleware
        const user = await User.findById(userId).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available via middleware
        const orders = await Order.find({ user: userId }).sort('-createdAt'); // Fetch user orders
        if (!orders) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: "User email is not verified." });
        }
        req.user = user; // Attach the user to the request
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params; // Extract order ID from the request params
        const order = await Order.findById(req.params.id).populate({
            path: 'orderLine.product',
            select: 'name price images description', // Include images explicitly
        })

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Send back relevant order details
        res.status(200).json({
            success: true,
            order: {
                id: order._id,
                orderLine: order.orderLine.map(item => ({
                    productName: item.product.name,
                    productImage: item.product.image,
                    productImage: item.product?.images[0]?.url,
                    description: item.product.description,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingFee: order.shippingFee,
                subtotal: order.orderLine.reduce((sum, item) => sum + item.price * item.quantity, 0),
            },
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch order details.' });
    }
};

exports.createReview = async (req, res) => {
  const { orderId, productId, rating, comment } = req.body;

  try {
    const order = await Order.findById(orderId);
    const product = await Product.findById(productId);

    // Ensure the order belongs to the logged-in user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You cannot review this order.' });
    }

    // Check if the product is in the order
    const isProductInOrder = order.orderLine.some(item => item.product.toString() === productId);
    if (!isProductInOrder) {
      return res.status(400).json({ message: 'Product not found in this order.' });
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    // Create the review
    const newReview = new Review({
      user: req.user.id,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      message: 'Review submitted successfully.',
      review: newReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
