declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_LENS_NETWORK: string;
    DATABASE_URL: string;
    PRIVATE_KEY: string;
    SECRET: string;
    EVENT_TRACKER_URL: string;
    EVER_ACCESS_KEY: string;
    EVER_ACCESS_SECRET: string;
    DISCORD_EVENT_WEBHOOK_TOPIC: string;
  }
}
