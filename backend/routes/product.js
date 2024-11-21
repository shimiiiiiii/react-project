const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    getProducts,
    getSingleProduct,
    getAdminProducts,
    newProduct,
    updateProduct,
    deleteProduct,
    getProductsByVariety,
    getProductMenu
} = require('../controllers/product');

const { getSuppliers } = require('../controllers/supplier');
const { isVerified, authorizeRoles } = require('../middlewares/auth');

router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);
router.get('/products-by-variety', getProductsByVariety);
router.get('/products/menu', getProductMenu);
router.get('/admin/products', getAdminProducts);
router.get('/suppliers', getSuppliers); 
router.post('/admin/product/new', isVerified, upload.array('images', 10), newProduct);
router.route('/admin/product/:id', isVerified).put(updateProduct).delete(deleteProduct); 


module.exports = router;
