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
      buildRequest={(amount) => ({ amount })}
      buttonLabel={`Wrap to ${WRAPPED_NATIVE_TOKEN_SYMBOL}`}
      refetch={refetch}
      resultKey="wrapTokens"
      successMessage="Wrap Successful"
      title="Wrap"
      useMutationHook={useWrapTokensMutation}
      value={value}
    />
  );
};

export default Wrap;
