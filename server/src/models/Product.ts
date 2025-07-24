
import mongoose, { Document, Schema } from 'mongoose';

// Define interfaces for type safety
export interface IMaterial {
  yarn: string;
  color: string;
  weight?: 'lace' | 'sport' | 'dk' | 'worsted' | 'chunky' | 'super-chunky';
}

export interface IDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: 'cm' | 'inches';
}

export interface IProduct extends Document {
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
  createdAt: Date;
  updatedAt: Date;
  formattedPrice: string; // Virtual field
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },

  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },

  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['scarves', 'hats', 'bags', 'home-decor', 'amigurumi', 'blankets'],
      message: 'Category must be one of: scarves, hats, bags, home-decor, amigurumi, blankets'
    }
  },

  images: [{
    type: String,
    required: true
  }],

  materials: [{
    yarn: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      enum: ['lace', 'sport', 'dk', 'worsted', 'chunky', 'super-chunky']
    }
  }],

  dimensions: {
    length: {
      type: Number,
      min: 0
    },
    width: {
      type: Number,
      min: 0
    },
    height: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },

  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },

  timeToMake: {
    type: String,
  },

  inStock: {
    type: Boolean,
    default: true
  },

  quantity: {
    type: Number,
    default: 1,
    min: 0
  },

  featured: {
    type: Boolean,
    default: false
  },

  tags: [{
    type: String,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Create indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ price: 1 });

// Virtual for formatted price
ProductSchema.virtual('formattedPrice').get(function (this: IProduct) {
  return `$${this.price.toFixed(2)}`;
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IProduct>('Product', ProductSchema);