declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_LENS_NETWORK: string;
    DATABASE_URL: string;
    PRIVATE_KEY: string;
    SECRET: string;
    EVENT_TRACKER_URL: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  }
}
