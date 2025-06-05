import { LENS_MAINNET_RPCS, LENS_TESTNET_RPCS } from "@hey/data/rpcs";
import type { FallbackTransport } from "viem";
import { http, fallback } from "viem";

interface GetRpcOptions {
  mainnet: boolean;
}

const BATCH_SIZE = 10;

const getRpc = ({ mainnet }: GetRpcOptions): FallbackTransport => {
  const rpcs = mainnet ? LENS_MAINNET_RPCS : LENS_TESTNET_RPCS;

  return fallback(
    rpcs.map((rpc) => http(rpc, { batch: { batchSize: BATCH_SIZE } }))
  );
};

export default getRpc;
