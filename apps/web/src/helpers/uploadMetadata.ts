import { Errors } from "@hey/data/errors";
import { immutable } from "@lens-chain/storage-client";
import { CHAIN } from "src/constants";
import { storageClient } from "./storageClient";

/**
 * Retrieves the given data to lens storage node.
 *
 * @param {any} data - The data to upload.
 * @returns {Promise<string>} - The storage node uri (lens://id).
 * @throws {Error} - An error if the upload fails.
 */
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
