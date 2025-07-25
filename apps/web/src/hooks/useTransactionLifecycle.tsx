import { ERRORS } from "@hey/data/errors";
import getTransactionData from "@hey/helpers/getTransactionData";
import type { ApolloClientError } from "@hey/types/errors";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";
import useHandleWrongNetwork from "./useHandleWrongNetwork";

const useTransactionLifecycle = () => {
  const { data } = useWalletClient();
  const handleWrongNetwork = useHandleWrongNetwork();

  const handleSponsoredTransaction = async (
    transactionData: any,
    onCompleted: (hash: string) => void
  ) => {
    await handleWrongNetwork();
    if (!data) return;
    return onCompleted(
      await sendEip712Transaction(data, {
        account: data.account,
        ...getTransactionData(transactionData.raw, { sponsored: true })
      })
    );
  };

  const handleSelfFundedTransaction = async (
    transactionData: any,
    onCompleted: (hash: string) => void
  ) => {
    await handleWrongNetwork();
    if (!data) return;
    return onCompleted(
      await sendTransaction(data, {
        account: data.account,
        ...getTransactionData(transactionData.raw)
      })
    );
  };

  const handleTransactionLifecycle = async ({
    transactionData,
    onCompleted,
    onError
  }: {
    transactionData: any;
    onCompleted: (hash: string) => void;
    onError: (error: ApolloClientError) => void;
  }) => {
    try {
      switch (transactionData.__typename) {
        case "SponsoredTransactionRequest":
          return await handleSponsoredTransaction(transactionData, onCompleted);
        case "SelfFundedTransactionRequest":
          return await handleSelfFundedTransaction(
            transactionData,
            onCompleted
          );
        case "TransactionWillFail":
          return onError({ message: transactionData.reason });
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
