
import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';

// Define types for query parameters
interface ProductQuery {
    category?: string;
    featured?: string;
    inStock?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
}

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request<{}, {}, {}, ProductQuery>, res: Response): Promise<void> => {
    try {
        const { category, featured, inStock, minPrice, maxPrice, search } = req.query;

        // Build query object
        let query: any = {};

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
        const products: IProduct[] = await Product.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error - Could not fetch products'
        });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate that ID exists and isn't empty
        if (!id || id.trim() === '') {
            res.status(404).json({
                success: false,
                error: 'Product ID is required'
            });
            return;
        }
        const product: IProduct | null = await Product.findById(id);

        if (!product) {
            res.status(404).json({
                success: false,
                error: 'Product not found'
            });
            return;
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Error fetching product:', error);

        // Handle invalid ObjectId
        if (error instanceof Error && error.name === 'CastError') {
            res.status(404).json({
                success: false,
                error: 'Invalid product ID format'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Server Error - Could not fetch product'
        });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req: Request<{ category: string }>, res: Response): Promise<void> => {
    try {
        const { category } = req.params;

        // Validate category exists
        if (!category || category.trim() === '') {
            res.status(400).json({
                success: false,
                error: 'Category is required'
            });
            return;
        }
        // Validate category is one of allowed values
        const allowedCategories = ['scarves', 'hats', 'bags', 'home-decor', 'amigurumi', 'blankets'];
        if (!allowedCategories.includes(category)) {
            res.status(400).json({
                success: false,
                error: `Invalid category. Must be one of: ${allowedCategories.join(', ')}`
            });
            return;
        }


        const products: IProduct[] = await Product.find({
            category: category,
            inStock: true
        }).sort({ featured: -1, createdAt: -1 });

        if (products.length === 0) {
            res.status(404).json({
                success: false,
                error: `No products found in category: ${category}`
            });
            return;
        }

        res.json({
            success: true,
            category: category,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error - Could not fetch products by category'
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products: IProduct[] = await Product.find({
            featured: true,
            inStock: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error - Could not fetch featured products'
        });
    }
};