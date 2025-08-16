import { useWithdrawMutation } from "@hey/indexer";
import type { Address } from "viem";
import TokenOperation from "./TokenOperation";

interface WithdrawProps {
  currency?: Address;
  value: string;
  refetch: () => void;
}

const Withdraw = ({ currency, value, refetch }: WithdrawProps) => {
  return (
    <TokenOperation
      buildRequest={(amount) =>
        currency ? { erc20: { currency, value: amount } } : { native: amount }
      }
      buttonLabel="Withdraw"
      refetch={refetch}
      resultKey="withdraw"
      successMessage="Withdrawal Successful"
      title="Withdraw"
      useMutationHook={useWithdrawMutation}
      value={value}
    />
  );
};

export default Withdraw;
