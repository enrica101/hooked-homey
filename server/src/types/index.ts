// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    count?: number;
    category?: string;
}

// Product query parameters
export interface ProductQueryParams {
    category?: string;
    featured?: string;
    inStock?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
}

// Environment variables
export interface EnvVars {
    PORT?: string;
    MONGODB_URI?: string;
    DB_NAME?: string;
    NODE_ENV?: string;
}

// Express route parameters
export interface ProductParams {
    id?: string;
    category?: string;
}

// Error types
export interface CustomError extends Error {
    statusCode?: number;
}