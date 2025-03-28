import { Button } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import type { MouseEvent } from "react";

interface LoginButtonProps {
  className?: string;
  isBig?: boolean;
  isFullWidth?: boolean;
  title?: string;
}

const LoginButton = ({
  className = "",
  isBig = false,
  isFullWidth = false,
  title = "Login"
}: LoginButtonProps) => {
  const { setShowAuthModal } = useAuthModalStore();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    return setShowAuthModal(true);
  };

  return (
    <Button
      className={cn(
        isFullWidth ? "flex w-full items-center justify-center" : "",
        className
      )}
      icon={
        <img
          alt="Lens Logo"
          className="mr-0.5 h-3"
          height={12}
          src={`${STATIC_IMAGES_URL}/brands/lens.svg`}
          width={19}
        />
      }
      onClick={handleClick}
      size={isBig ? "lg" : "md"}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
