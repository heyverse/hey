import { CHAIN } from "@hey/data/constants";
import logger from "@hey/helpers/logger";
import { useConnections, useSwitchChain } from "wagmi";

interface HandleWrongNetworkParams {
  chainId?: number;
}

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections();
  const { switchChainAsync } = useSwitchChain();
  const isConnected = () => activeConnection[0] !== undefined;

  const handleWrongNetwork = async (params?: HandleWrongNetworkParams) => {
    const chainId = params?.chainId ?? CHAIN.id;

    const isWrongNetwork = () => activeConnection[0]?.chainId !== chainId;

    if (!isConnected()) {
      logger.warn("No active connection found.");
      return;
    }

    if (isWrongNetwork()) {
      try {
        await switchChainAsync({ chainId });
      } catch (error) {
        logger.error("Failed to switch chains:", error);
      }
    }
  };

  return handleWrongNetwork;
};

export default useHandleWrongNetwork;
