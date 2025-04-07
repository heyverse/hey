import { Button } from "@/components/Shared/UI";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useSignupStore } from "../Auth/Signup";

interface SignupButtonProps {
  className?: string;
}

const SignupButton = ({ className }: SignupButtonProps) => {
  const { setShowAuthModal } = useAuthModalStore();
  const { setScreen } = useSignupStore();

  return (
    <Button
      onClick={() => {
        setScreen("choose");
        setShowAuthModal(true, "signup");
      }}
      outline
      size="md"
      className={className}
    >
      Signup
    </Button>
  );
};

export default SignupButton;
