declare namespace NodeJS {
  interface ProcessEnv {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    DATABASE_URL: string;
    EVER_ACCESS_KEY: string;
    EVER_ACCESS_SECRET: string;
    LENS_DATABASE_PASSWORD: string;
    PRIVATE_KEY: string;
    SECRET: string;
    SLACK_WEBHOOK_URL: string;
    OPENAI_API_KEY: string;
  }
}
