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
      useMutationHook={useWithdrawMutation}
      buildRequest={(amount) =>
        currency ? { erc20: { currency, value: amount } } : { native: amount }
      }
      resultKey="withdraw"
      buttonLabel="Withdraw"
      title="Withdraw"
      successMessage="Withdrawal Successful"
      value={value}
      refetch={refetch}
    />
  );
};

export default Withdraw;
