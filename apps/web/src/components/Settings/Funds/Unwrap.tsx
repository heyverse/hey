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
      useMutationHook={useUnwrapTokensMutation}
      buildRequest={(amount) => ({ amount })}
      resultKey="unwrapTokens"
      buttonLabel={`Unwrap to ${NATIVE_TOKEN_SYMBOL}`}
      title="Unwrap"
      successMessage="Unwrap Successful"
      value={value}
      refetch={refetch}
    />
  );
};

export default Unwrap;
