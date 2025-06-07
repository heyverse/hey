import { useTransactionStatusLazyQuery } from "@hey/indexer";
import { useCallback } from "react";

const INITIAL_DELAY = 1000;
const MAX_DELAY = 10000;
const MAX_TIMEOUT = 60000;

const useWaitForTransactionToComplete = () => {
  const [getTransactionStatus] = useTransactionStatusLazyQuery({
    fetchPolicy: "no-cache"
  });

  const waitForTransactionToComplete = useCallback(
    async (hash: string, timeout = MAX_TIMEOUT) => {
      let delay = INITIAL_DELAY;
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const { data } = await getTransactionStatus({
          variables: { request: { txHash: hash } }
        });

        if (
          data?.transactionStatus?.__typename === "FinishedTransactionStatus"
        ) {
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, MAX_DELAY);
      }
    },
    [getTransactionStatus]
  );

  return waitForTransactionToComplete;
};

export default useWaitForTransactionToComplete;
