import { STSClient } from "@aws-sdk/client-sts";
import { EVER_API, EVER_REGION } from "@hey/data/constants";

const stsClient = new STSClient({
  credentials: {
    accessKeyId: process.env.EVER_ACCESS_KEY as string,
    secretAccessKey: process.env.EVER_ACCESS_SECRET as string
  },
  endpoint: EVER_API,
  region: EVER_REGION
});

export default stsClient;
