const productService = require('../services/product.service');

function listProducts(req, res, next) {
  try {
    res.json(productService.getAllProducts());
  } catch (error) {
    next(error);
  }
}

function getProductById(req, res, next) {
  try {
    res.json(productService.getProduct(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, getProductById };
