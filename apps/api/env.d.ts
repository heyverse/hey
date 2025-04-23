declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_LENS_NETWORK: string;
    DATABASE_URL: string;
    LENS_DATABASE_URL: string;
    REDIS_URL: string;
    PRIVATE_KEY: string;
    EVER_ACCESS_KEY: string;
    EVER_ACCESS_SECRET: string;
    SHARED_SECRET: string;
  }
}
