// src/controllers/productController.js
const Product = require('../models/Product');

let error500 = {
    success: false,
    error: 'Server Error - Could not fetch product'
}
// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, featured, inStock, minPrice, maxPrice, search } = req.query;

        // Build query object
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by featured status
        if (featured !== undefined) {
            query.featured = featured === 'true';
        }

        // Filter by stock status
        if (inStock !== undefined) {
            query.inStock = inStock === 'true';
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Search in name and description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Execute query with sorting
        const products = await Product.find(query).sort({ createdAt: -1 })

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Error fetching products: ', error);
        res.status(500).json(error500);
    }
}

// @desc    Get single product by ID
// @route   GET /api/product/:id
// @access  Public
const getProductById = async (req, res) => {
    // Error handling with try-catch 
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product,
        })

    } catch (error) {
        console.error('Error fetching product: ', error);

        //Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(500).json(error500)
    }
}

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({
            category: category,
            inStock: true
        }).sort({ featured: -1, createdAt: -1 })

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No products found in category: ${category}`
            });
        }

        res.json({
            success: true,
            data: products,
            category: category,
            count: products.length
        })
    } catch (error) {
        console.error('Error fetching products by category ', error)
        error500.error = 'Server Error - Could not fetch products by category'
        res.status(500).json(error500)
    }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ featured: true, inStock: true }).sort({ createdAt: -1 });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Featured Products not found'
            });
        }

        res.json({
            success: true,
            data: products,
            count: products.length,
        })
    } catch (error) {
        console.error('Error fetching featured products ', error);
        error500 = 'Server Error - Could not fetch featured products'
        res.status(500).json(error500)
    }
}

module.exports = {
    getProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts
};