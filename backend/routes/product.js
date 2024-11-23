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
    getVarieties,
    getProductMenu,
    VarietyDetail,
    getAllProducts,
} = require('../controllers/product');

const { getSuppliers } = require('../controllers/supplier');
const { isVerified, authorizeRoles } = require('../middlewares/auth');

router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);
router.get('/products/all', getAllProducts);
router.get('/products-by-variety', getVarieties);
router.get('/products/variety/:id', VarietyDetail);
router.get('/products/menu', getProductMenu);
router.get('/admin/products', getAdminProducts);
router.get('/suppliers', getSuppliers); 
router.post('/admin/product/new', isVerified, upload.array('images', 10), newProduct);
router.route('/admin/product/:id', isVerified).put(updateProduct).delete(deleteProduct); 


module.exports = router;
