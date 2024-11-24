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
    bulkDelete,
    getVarieties,
    getProductMenu,
    VarietyDetail,
    getAllProducts,
} = require('../controllers/product');

const { isVerified, authorizeRoles } = require('../middlewares/auth');

router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);
router.get('/products/all', getAllProducts);
router.get('/products-by-variety', getVarieties);
router.get('/products/variety/:id', VarietyDetail);
router.get('/products/menu', getProductMenu);
router.get('/admin/products', getAdminProducts);
router.post('/admin/product/new', isVerified, upload.array('images', 10), newProduct);
router.route('/admin/product/:id')
    .put(isVerified, authorizeRoles('admin'), upload.array('images', 10), updateProduct)
    .delete(isVerified, authorizeRoles('admin'), deleteProduct);
router.post('/admin/product/bulk-delete', isVerified, authorizeRoles('admin'), bulkDelete);

module.exports = router;
