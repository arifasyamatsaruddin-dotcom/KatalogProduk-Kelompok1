const cartService = require('../services/cart.service');

function getCart(req, res, next) {
  try {
    res.json(cartService.getCartSummary());
  } catch (error) {
    next(error);
  }
}

function addCartItem(req, res, next) {
  try {
    const item = cartService.addItem(req.body);
    res.status(201).json({ item, message: 'Item added to cart' });
  } catch (error) {
    next(error);
  }
}

function updateCartItem(req, res, next) {
  try {
    const item = cartService.updateItem(req.params.id, req.body);
    res.json({ item, message: 'Cart updated' });
  } catch (error) {
    next(error);
  }
}

function removeCartItem(req, res, next) {
  try {
    cartService.deleteItem(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
}

function clearCart(req, res, next) {
  try {
    cartService.clear();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCart, addCartItem, updateCartItem, removeCartItem, clearCart };

