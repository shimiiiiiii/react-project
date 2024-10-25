const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    getProducts,
    getSingleProduct,
    getAdminProducts,
    newProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product');

const { getSuppliers } = require('../controllers/supplier');
const { isVerified, authorizeRoles } = require('../middlewares/auth');

router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);
// router.get('/admin/products', isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
// router.post('/admin/product/new', isAuthenticatedUser, authorizeRoles('admin'), newProduct);
// router.put('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
// router.delete('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.get('/admin/products', getAdminProducts);
router.get('/suppliers', getSuppliers); 
router.post('/admin/product/new', isVerified, upload.array('images', 10), newProduct);
// router.post('/admin/product/new', upload.array('images'), newProduct); 
router.put('/admin/product/:id', updateProduct); 
router.delete('/admin/product/:id', deleteProduct);

module.exports = router;
