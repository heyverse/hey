import { CHAIN } from "@hey/data/constants";
import logger from "@hey/helpers/logger";
import { useConnections, useSwitchChain } from "wagmi";

const useHandleWrongNetwork = (props?: { chainId?: number }) => {
  const { chainId = CHAIN.id } = props ?? {};
  const activeConnection = useConnections();
  const { switchChainAsync } = useSwitchChain();

  const isConnected = () => activeConnection[0] !== undefined;
  const isWrongNetwork = () => activeConnection[0]?.chainId !== chainId;

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
