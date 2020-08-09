const express = require("express");
const { ensureLogin } = require("../controllers/account");
const {addToCart,getCart,deleteFromCart,placeOrder} = require('../controllers/order');
const router = express.Router();
 
router.post('/cart/:id', ensureLogin, addToCart);
router.delete('/cart/:id', ensureLogin, deleteFromCart);
router.get('/cart', ensureLogin, getCart);
router.post('/order', ensureLogin, placeOrder);

module.exports = router;