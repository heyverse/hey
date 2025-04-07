import { H4, Image } from "@/components/Shared/UI";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreateGroupStore } from "./CreateGroup";

const Success = () => {
  const navigate = useNavigate();
  const { groupAddress, setScreen } = useCreateGroupStore();

  useEffect(() => {
    setTimeout(() => {
      if (groupAddress) {
        navigate(`/g/${groupAddress}`);
        setScreen("details");
      }
    }, 3000);
  }, [groupAddress]);

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>Waaa-hey! You got your group!</H4>
      <div className="mt-3 text-center font-semibold text-gray-500 dark:text-gray-200">
        Welcome to decentralised social where everything is sooooooooooooo much
        better! 🎉
      </div>
      <Image
        alt="Dizzy emoji"
        className="mx-auto mt-8 size-14"
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
        height={56}
        width={56}
      />
      <i className="mt-8 text-gray-500 dark:text-gray-200">
        We are taking you to your group...
      </i>
    </div>
  );
};

export default Success;
