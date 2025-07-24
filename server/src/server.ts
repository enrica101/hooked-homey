// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
// import productRoutes from './routes/products';
import productRoutes from './routes/test-products';
dotenv.config();

const app = express();

// CORS and middleware setup (keep your existing config)
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (keep your existing connectDB function)
const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        const conn = await mongoose.connect(mongoUri);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
};

connectDB();

// Root route
app.get('/', (req: Request, res: Response): void => {
    res.json({
        message: 'Welcome to Hooked & Homey API! 🪝',
        status: 'Server is running successfully',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// API Routes - Make sure this is correct
app.use('/api/products', productRoutes);

// 404 handler
app.use('*', (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});

const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, (): void => {
    console.log(`🚀 Hooked & Homey server running on port ${PORT}`);
    console.log(`📍 Visit: http://localhost:${PORT}`);
});