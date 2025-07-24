const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Routes
const productRoutes = require('./routes/products');

// Create Express app
const app = express();

// CORS Configuration
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
app.use(cors(corsOptions)); // Enable CORS for specific routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error: ', error.message);
        process.exit(1);
    }
}

// Connect to database
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Hooked & Homey API 🪝',
        status: 'Server is running successfully',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints: {
            products: '/api/products',
            featured: '/api/products/featured',
            categories: '/api/products/category/:category',
            singleProduct: '/api/product/:id'
        }
    });
});

//API Routes
app.use('/api/products', productRoutes)


// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('❌ Unhandled Promise Rejections: ', err.message);
    process.exit(1);
})

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Hooked & Homey server running on port ${PORT}`);
    console.log(`📍 Visit http://localhost:${PORT}`)
    console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
})