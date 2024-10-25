const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    getSuppliers,
    getSingleSupplier,
    newSupplier,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplier');

const { isVerified, authorizeRoles } = require('../middlewares/auth'); // Uncomment if using authentication middleware

router.get('/admin/suppliers', getSuppliers);
router.get('/admin/supplier/:id', getSingleSupplier);
// router.post('/admin/supplier/new', isVerified, authorizeRoles('admin'), newSupplier); // Uncomment for admin access

router.post('/admin/supplier/new', newSupplier); // No auth for testing
router.put('/admin/supplier/:id', updateSupplier); // No auth for testing
router.delete('/admin/supplier/:id', deleteSupplier); // No auth for testing

module.exports = router;
