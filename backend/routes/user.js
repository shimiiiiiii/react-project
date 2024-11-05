const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { 
    register, 
    login,
    getProfile,
    verifyEmail,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    allUsers,
    getDetails,
    // updateUser,
} = require('../controllers/user');

const { isVerified, authorizeRoles } = require('../middlewares/auth');

router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.get('/profile', isVerified, getProfile)
router.put('/profile/update', isVerified,  upload.single('photo'), updateProfile)
router.put('/password/update', isVerified, updatePassword)
router.post('/password/forgot', isVerified);
router.put('/password/reset/:token', resetPassword);
router.post('/verify', verifyEmail);
router.get('/verify/:token', verifyEmail);

// router.get('/admin/users', isVerified, authorizeRoles('admin'), allUsers)
// router.route('/admin/user/:id').get(isVerified,  getDetails).put(isVerified, updateUser)

module.exports = router;