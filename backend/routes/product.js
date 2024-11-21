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

const { getVarieties } = require('../controllers/variety');
const { isVerified, authorizeRoles } = require('../middlewares/auth');

router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);
router.get('/admin/products', getAdminProducts);
router.get('/varieties', getVarieties); 
router.post('/admin/product/new', isVerified, upload.array('images', 10), newProduct);
router.route('/admin/product/:id', isVerified).put(updateProduct).delete(deleteProduct); 


module.exports = router;
