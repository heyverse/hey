import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Link } from "react-router";
import { Card, H4, Image } from "@/components/Shared/UI";
import { useENSCreateStore } from ".";

const Success = () => {
  const { chosenUsername } = useENSCreateStore();

  return (
    <Card className="flex flex-col items-center justify-center p-5">
      <H4>Waaa-hey! You got your ENS name!</H4>
      <div className="mt-3 text-center font-semibold text-gray-500 dark:text-gray-200">
        Congrats on claiming your unique ENS name that will last forever! 🎉
      </div>
      <div className="linkify mt-3 text-gray-500 dark:text-gray-200">
        Visit{" "}
        <Link
          target="_blank"
          to={`https://app.ens.domains/${chosenUsername}.hey.xyz`}
        >
          ENS Dashboard
        </Link>
      </div>
      <Image
        alt="Dizzy emoji"
        className="mx-auto mt-8 size-14"
        height={56}
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
        width={56}
      />
    </Card>
  );
};

export default Success;
