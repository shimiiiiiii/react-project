const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    dateOfBirth: {
        type: Date,
        // required: [true, 'Please enter your birth date'],
    },
    photos: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ],
    
    // accountStatus: {
    //     type: String,
    //     enum: ['active', 'pending', 'suspended'],
    //     default: 'active'
    // },  
    
    isVerified: {  // Email verification status
        type: Boolean,
        default: false 
    },
    verificationToken: String, // Token for email verification
    verificationExpire: Date,   // Expiration date for the token
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token using unique id
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        // expiresIn: process.env.JWT_EXPIRES_TIME
        expiresIn: '7d'
    });
};

// compares plaintext with hashed pass
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// reset token password
userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString('hex'); //token

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex'); //hash and resetpass

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; //token expiration

    return resetToken;
};

userSchema.methods.getVerificationToken = function() {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    this.verificationExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    console.log('Generated plain verification token:', verificationToken); 
    console.log('Hashed and saved token:', this.verificationToken); // Add this for debugging

    return verificationToken;
};


module.exports = mongoose.model('User', userSchema);
