import { Button } from "@/components/Shared/UI";
import {
  type FundingToken,
  useFundModalStore
} from "@/store/non-persisted/modal/useFundModalStore";

interface TopUpButtonProps {
  size?: "sm" | "md";
  outline?: boolean;
  className?: string;
  token?: FundingToken;
  label?: string;
}

const TopUpButton = ({
  size = "md",
  outline = false,
  className = "",
  token,
  label = "Top-up your account"
}: TopUpButtonProps) => {
  const { setShowFundModal } = useFundModalStore();

  return (
    <Button
      aria-label={label}
      className={className}
      onClick={() => setShowFundModal(true, token)}
      size={size}
      outline={outline}
    >
      {label}
    </Button>
  );
};

export default TopUpButton;
