import CountdownTimer from "@/components/Shared/CountdownTimer";
import { Button, Card } from "@/components/Shared/UI";
import { rubikMonoOneFont } from "@/helpers/fonts";
import { APP_NAME, APP_URL, STATIC_IMAGES_URL } from "@hey/data/constants";
import Image from "next/image";
import Link from "next/link";

const Gitcoin = () => {
  return (
    <Card
      as="aside"
      className="!border-[#3D614D] !bg-[#3D614D]/10 mb-4 space-y-4 p-5 text-[#3D614D] dark:bg-[#3D614D]/50"
    >
      <Image
        alt="Gitcoin emoji"
        className="mx-auto h-20"
        src={`${STATIC_IMAGES_URL}/brands/gitcoin.svg`}
        height={80}
        width={80}
      />
      <div className="space-y-3 text-center">
        <b>Support {APP_NAME} on Gitcoin Grants Round 22</b>
        <div className={rubikMonoOneFont.className}>
          <CountdownTimer targetDate="2024-11-07T00:59:00+00:00" />
        </div>
        <div>
          <Link
            className="font-bold underline"
            href={`${APP_URL}/gitcoin`}
            target="_blank"
          >
            <Button size="lg">Contribute now</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Gitcoin;
