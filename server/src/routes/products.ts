// src/routes/products.ts
import express, { Request, Response } from 'express';
import {
    getProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts
} from '../controllers/productController';

const router = express.Router();

// IMPORTANT: Order matters! More specific routes first

// @route   GET /api/products/featured
// @desc    Get featured products only
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/category/:category
// @desc    Get products by specific category
// @params  category: scarves, hats, bags, home-decor, amigurumi, blankets
// Make sure :category is properly defined
router.get('/category/:category', (req: Request, res: Response): void => {
    // Add validation middleware
    if (!req.params.category || req.params.category.trim() === '') {
        res.status(400).json({
            success: false,
            error: 'Category parameter is required'
        });
        return;
    }
}, getProductsByCategory);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @params  id: MongoDB ObjectId
// Make sure :id is properly defined
router.get('/:id', (req: Request, res: Response): void => {
    // Add validation middleware
    if (!req.params.id || req.params.id.trim() === '') {
        res.status(400).json({
            success: false,
            error: 'Product ID parameter is required'
        });
        return;
    }
}, getProductById);

// @route   GET /api/products(this should be last)
// @desc    Get all products with optional filtering
// @query   ?category=scarves&featured=true&inStock=true&search=cozy
router.get('/', getProducts);

export default router;