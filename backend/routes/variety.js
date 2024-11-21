const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    getVarieties,
    getSingleVariety,
    newVariety,
    updateVariety,
    deleteVariety
} = require('../controllers/variety');

const { isVerified, authorizeRoles } = require('../middlewares/auth'); 

// Routes for Varieties
router.get('/varieties', getVarieties);
router.get('/variety/:id', getSingleVariety);
router.post('/admin/variety/new', isVerified, authorizeRoles('admin'), upload.array('images', 10), newVariety);
router.route('/admin/variety/:id')
    .put(isVerified, authorizeRoles('admin'), upload.array('images', 10), updateVariety)
    .delete(isVerified, authorizeRoles('admin'), deleteVariety);

// Routes without authentication for testing (comment out after testing)
// router.post('/admin/variety/new', upload.array('images', 10), newVariety);
// router.put('/admin/variety/:id', upload.array('images', 10), updateVariety);
// router.delete('/admin/variety/:id', deleteVariety);

module.exports = router;
