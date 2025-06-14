import { CHAIN } from "@hey/data/constants";
import { ERRORS } from "@hey/data/errors";
import { immutable } from "@lens-chain/storage-client";
import { storageClient } from "./storageClient";

interface MetadataPayload {
  [key: string]: unknown;
}

const uploadMetadata = async (
  data: MetadataPayload | null
): Promise<string> => {
  try {
    const { uri } = await storageClient.uploadAsJson(data, {
      acl: immutable(CHAIN.id)
    });

    return uri;
  } catch {
    throw new Error(ERRORS.SomethingWentWrong);
  }
};

export default uploadMetadata;
