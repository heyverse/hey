import { AssumeRoleCommand, STSClient } from "@aws-sdk/client-sts";
import { EVER_API, EVER_BUCKET, EVER_REGION } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Context } from "hono";

const params = {
  DurationSeconds: 900,
  Policy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:AbortMultipartUpload"
        ],
        "Resource": [
          "arn:aws:s3:::${EVER_BUCKET}/*"
        ]
      }
    ]
  }`
};

const getSTS = async (ctx: Context) => {
  try {
    const stsClient = new STSClient({
      credentials: {
        accessKeyId: process.env.EVER_ACCESS_KEY as string,
        secretAccessKey: process.env.EVER_ACCESS_SECRET as string
      },
      endpoint: EVER_API,
      region: EVER_REGION
    });
    const command = new AssumeRoleCommand({
      ...params,
      RoleArn: undefined,
      RoleSessionName: undefined
    });
    const { Credentials: credentials } = await stsClient.send(command);

    return ctx.json({
      success: true,
      data: {
        accessKeyId: credentials?.AccessKeyId,
        secretAccessKey: credentials?.SecretAccessKey,
        sessionToken: credentials?.SessionToken
      }
    });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getSTS;
