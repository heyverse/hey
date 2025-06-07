import { CHAIN } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { immutable } from "@lens-chain/storage-client";
import { storageClient } from "./storageClient";

const uploadMetadata = async (data: any): Promise<string> => {
  try {
    const { uri } = await storageClient.uploadAsJson(data, {
      acl: immutable(CHAIN.id)
    });

    return uri;
  } catch {
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default uploadMetadata;
