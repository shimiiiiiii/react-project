const express = require('express');
const { addToCart } = require('../controllers/cart');
const { getCartItems } = require('../controllers/cart');
const {createTransaction} = require('../controllers/cart');
const {getOrders} = require('../controllers/cart');
const { updateOrderStatus } = require('../controllers/cart');
const {deleteCartItem} = require('../controllers/cart');
const {updateCartItemQuantity} = require('../controllers/cart');
const { verifyToken, isVerified, authorizeRoles } = require('../middlewares/auth');


const router = express.Router();

// Add to Cart Route
router.post('/cart', verifyToken, isVerified, addToCart, authorizeRoles('user'));
router.get('/cart/display', isVerified, getCartItems);
router.delete('/cart/delete/:id', verifyToken, isVerified, deleteCartItem, authorizeRoles('user'));
router.put('/cart/update/:cartItemId', verifyToken, isVerified, updateCartItemQuantity);
router.post ('/cart/checkout', verifyToken, isVerified, createTransaction, authorizeRoles('user'));
router.get('/orders', getOrders);
router.put('/order/:id',verifyToken, isVerified,updateOrderStatus, authorizeRoles('admin'));

module.exports = router;
