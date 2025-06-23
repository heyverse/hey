import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Button, Card, Image } from "@/components/Shared/UI";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useSignupStore } from "./Signup";

const SignupCard = () => {
  const { setShowAuthModal } = useAuthModalStore();
  const { setScreen } = useSignupStore();

  const handleSignupClick = () => {
    setScreen("choose");
    setShowAuthModal(true, "signup");
  };

  return (
    <Card className="space-y-4 p-5">
      <Image
        alt="Dizzy emoji"
        className="mx-auto size-14"
        height={56}
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
        width={56}
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">Get your Hey account now!</div>
        <div>
          <Button onClick={handleSignupClick}>Signup now</Button>
        </div>
      </div>
    </Card>
  );
};

export default SignupCard;
