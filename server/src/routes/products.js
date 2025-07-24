// src/routes/products.js
const express = require('express');
const {
    getProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts
} = require('../controllers/productController');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with optional filtering
// @query   ?category=scarves&featured=true&inStock=true&search=cozy
router.get('/', getProducts);

// @route   GET /api/products/featured
// @desc    Get featured products only
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/category/:category
// @desc    Get products by specific category
// @params  category: scarves, hats, bags, home-decor, amigurumi, blankets
router.get('/category/:category', getProductsByCategory);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @params  id: MongoDB ObjectId
router.get('/:id', getProductById);

module.exports = router;