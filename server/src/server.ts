// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import productRoutes from './routes/products';
// import productRoutes from './routes/test-products'; // Minimal Server for Testing

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Define API endpoints interface for documentation
interface ApiEndpoints {
    products: string;
    featured: string;
    categories: string;
    singleProduct: string;
}

// Routes
app.get('/', (req: Request, res: Response): void => {
    const endpoints: ApiEndpoints = {
        products: '/api/products',
        featured: '/api/products/featured',
        categories: '/api/products/category/:category',
        singleProduct: '/api/products/:id'
    };

    res.json({
        message: 'Welcome to Hooked & Homey API! 🪝',
        status: 'Server is running successfully',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints
    });
});

// API Routes
app.use('/api/products', productRoutes);

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: Function): void => {
    console.error('❌ Global error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err: Error): void => {
    console.log('❌ Unhandled Promise Rejection:', err.message);
    process.exit(1);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err: Error): void => {
    console.log('❌ Uncaught Exception:', err.message);
    process.exit(1);
});

// Set port with type safety
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Start server
app.listen(PORT, (): void => {
    console.log(`🚀 Hooked & Homey server running on port ${PORT}`);
    console.log(`📍 Visit: http://localhost:${PORT}`);
    console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
});