import { LENS_MAINNET_RPCS, LENS_TESTNET_RPCS } from "@hey/data/rpcs";
import type { FallbackTransport } from "viem";
import { http, fallback } from "viem";

const getRpc = ({ mainnet }: { mainnet: boolean }): FallbackTransport => {
  if (mainnet) {
    return fallback(
      LENS_MAINNET_RPCS.map((rpc) => http(rpc, { batch: { batchSize: 10 } }))
    );
  }

  return fallback(
    LENS_TESTNET_RPCS.map((rpc) => http(rpc, { batch: { batchSize: 10 } }))
  );
};

export default getRpc;
