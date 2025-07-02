import { AssumeRoleCommand } from "@aws-sdk/client-sts";
import { EVER_BUCKET } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import handleApiError from "../../utils/handleApiError";
import stsClient from "../../utils/stsClient";

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
    const command = new AssumeRoleCommand({
      ...params,
      RoleArn: undefined,
      RoleSessionName: undefined
    });
    const { Credentials: credentials } = await stsClient.send(command);

    return ctx.json({
      data: {
        accessKeyId: credentials?.AccessKeyId,
        secretAccessKey: credentials?.SecretAccessKey,
        sessionToken: credentials?.SessionToken
      },
      status: Status.Success
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default getSTS;
