import { useTransactionStatusLazyQuery } from "@hey/indexer";
import { useCallback } from "react";

const POLL_INTERVAL = 1000;
const MAX_CHECK_COUNT = 5;

const usePollTransactionStatus = () => {
  const [getTransactionStatus] = useTransactionStatusLazyQuery({
    fetchPolicy: "no-cache"
  });

  const pollTransactionStatus = useCallback(
    async (hash: string, onFinished: () => void) => {
      for (let i = 0; i < MAX_CHECK_COUNT; i++) {
        const { data } = await getTransactionStatus({
          variables: { request: { txHash: hash } }
        });

        if (
          data?.transactionStatus?.__typename === "FinishedTransactionStatus"
        ) {
          onFinished();
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      }

      onFinished();
    },
    [getTransactionStatus]
  );

  return pollTransactionStatus;
};

export default usePollTransactionStatus;
