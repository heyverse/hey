import awsLite from "@aws-lite/client";
import s3Plugin from "@aws-lite/s3";
import { EVER_API, EVER_REGION } from "@hey/data/constants";

let s3: any;

export const getS3 = async () => {
  if (!s3) {
    const client: any = await awsLite({
      accessKeyId: process.env.EVER_ACCESS_KEY as string,
      secretAccessKey: process.env.EVER_ACCESS_SECRET as string,
      endpoint: EVER_API,
      region: EVER_REGION,
      plugins: [s3Plugin]
    });
    s3 = client.S3;
  }
  return s3 as any;
};
