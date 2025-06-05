import { CHAIN } from "@hey/data/constants";
import { useCallback } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

const useHandleWrongNetwork = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  return useCallback(async () => {
    if (!isConnected) {
      console.warn("No active connection found.");
      return;
    }

    if (chainId !== CHAIN.id) {
      try {
        await switchChainAsync({ chainId: CHAIN.id });
      } catch (error) {
        console.error("Failed to switch chains:", error);
      }
    }
  }, [chainId, isConnected, switchChainAsync]);
};

export default useHandleWrongNetwork;
