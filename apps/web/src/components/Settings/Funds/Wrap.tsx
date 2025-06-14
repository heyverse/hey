import { WRAPPED_NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import { useWrapTokensMutation } from "@hey/indexer";
import TokenOperation from "./TokenOperation";

interface WrapProps {
  value: string;
  refetch: () => void;
}

const Wrap = ({ value, refetch }: WrapProps) => {
  return (
    <TokenOperation
      useMutationHook={useWrapTokensMutation}
      buildRequest={(amount) => ({ amount })}
      resultKey="wrapTokens"
      buttonLabel={`Wrap to ${WRAPPED_NATIVE_TOKEN_SYMBOL}`}
      title="Wrap"
      successMessage="Wrap Successful"
      value={value}
      refetch={refetch}
    />
  );
};

export default Wrap;
