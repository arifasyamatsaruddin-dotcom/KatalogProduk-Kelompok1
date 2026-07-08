const { listCart, addCartItem, updateCartItem, removeCartItem, getCartTotal, clearCart } = require('../models/cart.model');

function getCartSummary() {
  const items = listCart();
  return {
    items,
    total: getCartTotal()
  };
}

function addItem(item) {
  return addCartItem(item);
}

function updateItem(id, updates) {
  return updateCartItem(id, updates);
}

function deleteItem(id) {
  return removeCartItem(id);
}

function clear() {
  return clearCart();
}

module.exports = { getCartSummary, addItem, updateItem, deleteItem, clear };

