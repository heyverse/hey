import { run } from "pierre";

export const label = "Deploy";

const BUCKET_NAME = "hey-web"; // R2 bucket
const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CF_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CF_SECRET_ACCESS_KEY;

export default async ({ branch }) => {
  if (branch.name !== "main") {
    throw new Error("Only main branch is allowed to deploy");
  }

  await run("cd apps/web && pnpm build", {
    label: "Building web"
  });

  // Upload build to R2 using AWS CLI-compatible interface
  await run(
    `AWS_ACCESS_KEY_ID=${ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY} ` +
      `aws s3 sync apps/web/dist/ s3://${BUCKET_NAME} ` +
      `--endpoint-url=https://${ACCOUNT_ID}.r2.cloudflarestorage.com --delete`,
    {
      label: "Uploading build to Cloudflare R2"
    }
  );
};
