import { ERRORS } from "@hey/data/errors";
import getTransactionData from "@hey/helpers/getTransactionData";
import type {
  SelfFundedTransactionRequestFragment,
  SponsoredTransactionRequestFragment,
  TransactionWillFailFragment
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";
import logEvent from "@/helpers/logEvent";
import useHandleWrongNetwork from "./useHandleWrongNetwork";

type AnyTransactionRequestFragment =
  | SelfFundedTransactionRequestFragment
  | SponsoredTransactionRequestFragment
  | TransactionWillFailFragment
  | { __typename?: string; hash?: unknown }
  | ((...args: never[]) => unknown);

const useTransactionLifecycle = () => {
  const { data } = useWalletClient();
  const handleWrongNetwork = useHandleWrongNetwork();

  const handleSponsoredTransaction = async (
    transactionData: AnyTransactionRequestFragment,
    onCompleted: (hash: string) => void
  ) => {
    if (
      typeof transactionData === "function" ||
      transactionData.__typename !== "SponsoredTransactionRequest" ||
      !("raw" in transactionData)
    ) {
      return;
    }
    await handleWrongNetwork();
    if (!data) return;
    void logEvent("Viem pending: SponsoredTransactionRequest");
    const txHash = await sendEip712Transaction(data, {
      account: data.account,
      ...getTransactionData(transactionData.raw, { sponsored: true })
    });
    void logEvent("Viem onSuccess: SponsoredTransactionRequest");
    return onCompleted(txHash);
  };

  const handleSelfFundedTransaction = async (
    transactionData: AnyTransactionRequestFragment,
    onCompleted: (hash: string) => void
  ) => {
    if (
      typeof transactionData === "function" ||
      transactionData.__typename !== "SelfFundedTransactionRequest" ||
      !("raw" in transactionData)
    ) {
      return;
    }
    await handleWrongNetwork();
    if (!data) return;
    void logEvent("Viem pending: SelfFundedTransactionRequest");
    const txHash = await sendTransaction(data, {
      account: data.account,
      ...getTransactionData(transactionData.raw)
    });
    void logEvent("Viem onSuccess: SelfFundedTransactionRequest");
    return onCompleted(txHash);
  };

  const handleTransactionLifecycle = async ({
    transactionData,
    onCompleted,
    onError
  }: {
    transactionData: AnyTransactionRequestFragment;
    onCompleted: (hash: string) => void;
    onError: (error: ApolloClientError) => void;
  }) => {
    try {
      if (typeof transactionData === "function") {
        return onError({ message: ERRORS.SomethingWentWrong });
      }
      switch (transactionData.__typename) {
        case "SponsoredTransactionRequest":
          return await handleSponsoredTransaction(transactionData, onCompleted);
        case "SelfFundedTransactionRequest":
          return await handleSelfFundedTransaction(
            transactionData,
            onCompleted
          );
        case "TransactionWillFail":
          if ("reason" in transactionData) {
            return onError({ message: transactionData.reason });
          }
          return onError({ message: ERRORS.SomethingWentWrong });
        default:
          onError({ message: ERRORS.SomethingWentWrong });
          return;
      }
    } catch (error) {
      return onError(error);
    }
  };

  return handleTransactionLifecycle;
};

export default useTransactionLifecycle;
