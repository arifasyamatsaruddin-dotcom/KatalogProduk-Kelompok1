const { listProducts, getProductById } = require('../models/product.model');

function getAllProducts() {
  return { products: listProducts() };
}

function getProduct(id) {
  const product = getProductById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
}

module.exports = { getAllProducts, getProduct };
