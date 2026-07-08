const express = require('express');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/', cartController.addCartItem);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

module.exports = router;

