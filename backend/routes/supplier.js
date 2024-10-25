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

const { isVerified, authorizeRoles } = require('../middlewares/auth'); 

router.get('/suppliers', getSuppliers);
router.get('/supplier/:id', getSingleSupplier);
router.post('/admin/supplier/new', isVerified, authorizeRoles('admin'), upload.array('images', 10), newSupplier); 
router.route('/admin/supplier/:id', isVerified).put(updateSupplier).delete(deleteSupplier); 

// router.post('/admin/supplier/new', newSupplier); // No auth for testing
// router.put('/admin/supplier/:id', updateSupplier); // No auth for testing
// router.delete('/admin/supplier/:id', deleteSupplier); // No auth for testing

module.exports = router;
