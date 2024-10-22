const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    getAllFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ
} = require('../controllers/faq');

// authentication middleware
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.get('/admin/faqs', getAllFAQs);
router.get('/admin/faq/:id', getFAQById);
router.post('/admin/faq/new', upload.single('imgPath'), createFAQ); 
router.put('/admin/faq/:id', upload.single('imgPath'), updateFAQ); 
router.delete('/admin/faq/:id', deleteFAQ);

//ADMIN
// router.post('/admin/faq/new', isAuthenticatedUser, authorizeRoles('admin'), createFAQ);
// router.put('/admin/faq/:id', isAuthenticatedUser, authorizeRoles('admin'), updateFAQ);
// router.delete('/admin/faq/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteFAQ);

module.exports = router;
