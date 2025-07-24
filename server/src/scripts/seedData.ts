
import mongoose from 'mongoose';
import Product, { IProduct, IMaterial, IDimensions } from '../models/Product';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the structure for our sample products
interface SampleProduct {
  name: string;
  description: string;
  price: number;
  category: 'scarves' | 'hats' | 'bags' | 'home-decor' | 'amigurumi' | 'blankets';
  images: string[];
  materials: IMaterial[];
  dimensions?: IDimensions;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToMake?: string;
  inStock: boolean;
  quantity: number;
  featured: boolean;
  tags: string[];
}

const sampleProducts: SampleProduct[] = [
  {
    name: "Cozy Winter Scarf",
    description: "Super soft merino wool scarf in sage green. Perfect for chilly mornings and adds a touch of elegance to any outfit.",
    price: 45.00,
    category: "scarves",
    images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400"],
    materials: [{
      yarn: "Merino Wool",
      color: "Sage Green",
      weight: "worsted"
    }],
    dimensions: {
      length: 180,
      width: 25,
      unit: "cm"
    },
    difficulty: "beginner",
    timeToMake: "4-6 hours",
    inStock: true,
    quantity: 3,
    featured: true,
    tags: ["winter", "cozy", "green", "wool"]
  },

  {
    name: "Textured Cable Beanie",
    description: "Warm and stylish beanie with classic cable pattern. Available in multiple colors to match your style.",
    price: 32.00,
    category: "hats",
    images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400"],
    materials: [{
      yarn: "Acrylic Blend",
      color: "Charcoal Gray",
      weight: "worsted"
    }],
    difficulty: "intermediate",
    timeToMake: "3-4 hours",
    inStock: true,
    quantity: 5,
    featured: false,
    tags: ["winter", "hat", "cable", "gray"]
  },

  {
    name: "Cotton Market Tote",
    description: "Eco-friendly cotton tote perfect for grocery shopping or beach days. Sturdy handles and spacious interior.",
    price: 38.00,
    category: "bags",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
    materials: [{
      yarn: "Organic Cotton",
      color: "Natural Beige",
      weight: "worsted"
    }],
    dimensions: {
      length: 40,
      width: 35,
      height: 15,
      unit: "cm"
    },
    difficulty: "beginner",
    timeToMake: "2-3 hours",
    inStock: true,
    quantity: 4,
    featured: true,
    tags: ["eco-friendly", "market", "cotton", "beige"]
  },

  {
    name: "Geometric Throw Pillow",
    description: "Modern geometric design in neutral tones. Includes removable cover for easy washing.",
    price: 28.00,
    category: "home-decor",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
    materials: [{
      yarn: "Cotton Blend",
      color: "Cream",
      weight: "dk"
    }, {
      yarn: "Cotton Blend",
      color: "Taupe",
      weight: "dk"
    }],
    dimensions: {
      length: 40,
      width: 40,
      height: 10,
      unit: "cm"
    },
    difficulty: "intermediate",
    timeToMake: "5-7 hours",
    inStock: true,
    quantity: 2,
    featured: false,
    tags: ["geometric", "pillow", "neutral", "modern"]
  },

  {
    name: "Adorable Bunny Amigurumi",
    description: "Handmade bunny in soft pastels. Perfect gift for little ones or bunny lovers of all ages.",
    price: 25.00,
    category: "amigurumi",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    materials: [{
      yarn: "Cotton",
      color: "Soft Pink",
      weight: "sport"
    }, {
      yarn: "Cotton",
      color: "White",
      weight: "sport"
    }],
    dimensions: {
      height: 20,
      width: 12,
      unit: "cm"
    },
    difficulty: "advanced",
    timeToMake: "8-10 hours",
    inStock: true,
    quantity: 1,
    featured: true,
    tags: ["amigurumi", "bunny", "pink", "gift", "cute"]
  },

  {
    name: "Rainbow Granny Square Throw",
    description: "Classic granny square pattern in vibrant rainbow colors. Perfect for adding color to any room.",
    price: 85.00,
    category: "blankets",
    images: ["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"],
    materials: [{
      yarn: "Acrylic",
      color: "Rainbow Mix",
      weight: "worsted"
    }],
    dimensions: {
      length: 150,
      width: 120,
      unit: "cm"
    },
    difficulty: "intermediate",
    timeToMake: "2-3 weeks",
    inStock: true,
    quantity: 1,
    featured: true,
    tags: ["rainbow", "granny-square", "colorful", "blanket", "throw"]
  }
];

const seedDatabase = async (): Promise<void> => {
  try {
    // Check if MongoDB URI exists
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products with proper typing
    const products: IProduct[] = await Product.insertMany(sampleProducts);
    console.log(`🌱 Seeded ${products.length} products successfully!`);

    // Display seeded products
    products.forEach((product: IProduct) => {
      console.log(`   ✅ ${product.name} - $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};

seedDatabase();