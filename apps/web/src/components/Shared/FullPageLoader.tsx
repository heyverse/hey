import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Image } from "@/components/Shared/UI";

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Image
        className="size-28"
        src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
        alt="Logo"
        height={112}
        width={112}
      />
    </div>
  );
};

export default FullPageLoader;
