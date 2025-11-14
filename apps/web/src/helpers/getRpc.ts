import { RPCS } from "@hey/data/rpcs";
import type { FallbackTransport } from "viem";
import { fallback, http } from "viem";

const BATCH_SIZE = 10;

const getRpc = (): FallbackTransport => {
  return fallback(
    RPCS.map((rpc) => http(rpc, { batch: { batchSize: BATCH_SIZE } }))
  );
};

export default getRpc;
