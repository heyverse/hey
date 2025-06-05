import { Button } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import type { FundingToken } from "@/store/non-persisted/modal/useFundModalStore";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { NULL_ADDRESS } from "@hey/data/constants";

interface SwapButtonProps {
  size?: "sm" | "md";
  outline?: boolean;
  className?: string;
  token?: FundingToken;
  label?: string;
}

const SwapButton = ({
  size = "md",
  outline = false,
  className = "",
  token,
  label = "Swap on Oku"
}: SwapButtonProps) => {
  const buildOkuTradeUrl = () => {
    const params = new URLSearchParams({
      utm_source: "hey.xyz",
      utm_medium: "sites",
      isExactOut: "false",
      inputChain: "lens",
      outToken: token?.contractAddress ?? NULL_ADDRESS
    });

    return `https://oku.trade/?${params.toString()}`;
  };

  const handleSwap = () => {
    window.open(buildOkuTradeUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      aria-label={label}
      className={cn(className, "flex items-center gap-1")}
      onClick={handleSwap}
      size={size}
      outline={outline}
    >
      <span>{label}</span>
      <ArrowUpRightIcon className="size-3" />
    </Button>
  );
};

export default SwapButton;
