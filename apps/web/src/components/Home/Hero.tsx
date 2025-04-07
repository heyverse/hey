import { Card, Image } from "@/components/Shared/UI";
import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";

const Hero = () => {
  return (
    <Card className="flex flex-col gap-y-5 p-12">
      <Image
        alt="Hey Logo"
        className="mr-5 size-16"
        src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
        width={144}
        height={144}
      />
      <div className="flex-1 space-y-1 tracking-tight">
        <div className="font-extrabold text-3xl">Welcome to {APP_NAME},</div>
        <div className="font-extrabold text-3xl text-neutral-500 dark:text-neutral-200">
          a social network built on Lens Protocol
        </div>
      </div>
    </Card>
  );
};

export default Hero;
