import { CHAIN } from "@hey/data/constants";
import logger from "@hey/helpers/logger";
import { useConnections, useSwitchChain } from "wagmi";

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections();
  const { switchChainAsync } = useSwitchChain();

  const isConnected = () => activeConnection[0] !== undefined;
  const isWrongNetwork = () => activeConnection[0]?.chainId !== CHAIN.id;

  const handleWrongNetwork = async () => {
    if (!isConnected()) {
      logger.warn("No active connection found.");
      return;
    }

    if (isWrongNetwork()) {
      try {
        await switchChainAsync({ chainId: CHAIN.id });
      } catch (error) {
        logger.error("Failed to switch chains:", error);
      }
    }
  };

  return handleWrongNetwork;
};

export default useHandleWrongNetwork;
