// src/routes/test-products.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// Simple test routes without parameters
router.get('/', (req: Request, res: Response): void => {
    res.json({ message: 'Products route working!' });
});

router.get('/featured', (req: Request, res: Response): void => {
    res.json({ message: 'Featured route working!' });
});

// Simple parameterized route
router.get('/test/:id', (req: Request, res: Response): void => {
    res.json({
        message: 'Test ID route working!',
        id: req.params.id
    });
});

export default router;