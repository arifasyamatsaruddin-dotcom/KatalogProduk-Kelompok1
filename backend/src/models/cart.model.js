let cartItems = [];
let nextId = 1;

function listCart() {
  return cartItems;
}

function addCartItem(item) {
  const existingItem = cartItems.find((entry) => entry.productId === item.productId);
  if (existingItem) {
    existingItem.quantity += item.quantity;
    return existingItem;
  }

  const newItem = {
    id: nextId++,
    ...item,
    name: item.name || 'Sneaker Item',
    price: item.price || 210,
    image: item.image || '',
    size: item.size || '10.5 US',
    sku: item.sku || 'LAB-001'
  };
  cartItems.push(newItem);
  return newItem;
}

function updateCartItem(id, updates) {
  const item = cartItems.find((entry) => entry.id === Number(id));
  if (!item) throw new Error('Cart item not found');

  if (updates.quantity !== undefined) {
    item.quantity = Math.max(0, item.quantity + updates.quantity);
    if (item.quantity === 0) {
      cartItems = cartItems.filter((entry) => entry.id !== Number(id));
      return null;
    }
  }

  return item;
}

function removeCartItem(id) {
  const removed = cartItems.find((entry) => entry.id === Number(id));
  cartItems = cartItems.filter((entry) => entry.id !== Number(id));
  return removed;
}

function getCartTotal() {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

function clearCart() {
  cartItems = [];
  nextId = 1;
  return cartItems;
}

module.exports = { listCart, addCartItem, updateCartItem, removeCartItem, getCartTotal, clearCart };

