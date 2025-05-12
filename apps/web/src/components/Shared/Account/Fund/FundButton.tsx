import { Button } from "@/components/Shared/UI";
import {
  type FundingToken,
  useFundModalStore
} from "@/store/non-persisted/modal/useFundModalStore";

interface TransferFundButtonProps {
  size?: "sm" | "md";
  outline?: boolean;
  className?: string;
  token?: FundingToken;
  label?: string;
}

const TransferFundButton = ({
  size = "md",
  outline = false,
  className = "",
  token,
  label = "Transfer fund"
}: TransferFundButtonProps) => {
  const { setShowFundModal } = useFundModalStore();

  return (
    <Button
      aria-label="Transfer fund"
      className={className}
      onClick={() => setShowFundModal(true, token)}
      size={size}
      outline={outline}
    >
      {label}
    </Button>
  );
};

export default TransferFundButton;
