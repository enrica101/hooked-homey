// src/routes/products.ts
import express from 'express';
import {
    getProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts
} from '../controllers/productController';

const router = express.Router();

// IMPORTANT: Order matters! More specific routes first

// GET /api/products/featured
router.get('/featured', getFeaturedProducts);

// GET /api/products/category/:category
// Make sure :category is properly defined
router.get('/category/:category', (req, res, next) => {
    // Add validation middleware
    if (!req.params.category || req.params.category.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Category parameter is required'
        });
    }
    next();
}, getProductsByCategory);

// GET /api/products/:id  
// Make sure :id is properly defined
router.get('/:id', (req, res, next) => {
    // Add validation middleware
    if (!req.params.id || req.params.id.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Product ID parameter is required'
        });
    }
    next();
}, getProductById);

// GET /api/products (this should be last)
router.get('/', getProducts);

export default router;