import { NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import { useUnwrapTokensMutation } from "@hey/indexer";
import TokenOperation from "./TokenOperation";

interface UnwrapProps {
  value: string;
  refetch: () => void;
}

const Unwrap = ({ value, refetch }: UnwrapProps) => {
  return (
    <TokenOperation
      buildRequest={(amount) => ({ amount })}
      buttonLabel={`Unwrap to ${NATIVE_TOKEN_SYMBOL}`}
      refetch={refetch}
      resultKey="unwrapTokens"
      successMessage="Unwrap Successful"
      title="Unwrap"
      useMutationHook={useUnwrapTokensMutation}
      value={value}
    />
  );
};

export default Unwrap;
