
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            MONGODB_URI: string;
            DB_NAME?: string;
            NODE_ENV?: 'development' | 'production' | 'test';
        }
    }
}

export { };