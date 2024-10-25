const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { 
    register, 
    login,
    getProfile,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    allUsers,
    getDetails,
    updateUser,
} = require('../controllers/user');

const { isVerified, authorizeRoles } = require('../middlewares/auth');

router.post('/register', upload.array('photos', 10), register);
router.post('/login', login);
router.get('/profile', isVerified, getProfile)
router.put('/profile/update', isVerified,  upload.array('photos', 10), updateProfile)
router.put('/password/update', isVerified, updatePassword)
router.post('/password/forgot', isVerified);
router.put('/password/reset/:token', resetPassword);

// router.get('/admin/users', isVerified, authorizeRoles('admin'), allUsers)
// router.route('/admin/user/:id').get(isVerified,  getDetails).put(isVerified, updateUser)

module.exports = router;