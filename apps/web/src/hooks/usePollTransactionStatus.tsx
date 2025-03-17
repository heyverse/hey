import { useTransactionStatusLazyQuery } from "@hey/indexer";
import { useCallback } from "react";

const usePollTransactionStatus = () => {
  const [getTransactionStatus] = useTransactionStatusLazyQuery({
    fetchPolicy: "no-cache"
  });

  const pollTransactionStatus = useCallback(
    async (hash: string, onFinished: () => void) => {
      const { data } = await getTransactionStatus({
        variables: { request: { txHash: hash } }
      });

      if (data?.transactionStatus?.__typename === "FinishedTransactionStatus") {
        onFinished();
      } else {
        setTimeout(() => pollTransactionStatus(hash, onFinished), 1000);
      }
    },
    [getTransactionStatus]
  );

  return pollTransactionStatus;
};

export default usePollTransactionStatus;
