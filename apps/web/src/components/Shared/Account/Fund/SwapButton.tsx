import { Button } from "@/components/Shared/UI";
import type { Address } from "viem";

interface SwapButtonProps {
  size?: "sm" | "md";
  outline?: boolean;
  className?: string;
  token?: Address;
  label?: string;
}

const SwapButton = ({
  size = "md",
  outline = false,
  className = "",
  token,
  label = "Swap"
}: SwapButtonProps) => {
  return (
    <Button
      aria-label="Swap"
      className={className}
      onClick={() =>
        window.open(
          `https://oku.trade/?inputChain=lens&inToken=0x0000000000000000000000000000000000000000&outToken=${token}&utm_source=hey`,
          "_blank"
        )
      }
      size={size}
      outline={outline}
    >
      {label}
    </Button>
  );
};

export default SwapButton;
