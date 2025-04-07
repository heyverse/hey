import CountdownTimer from "@/components/Shared/CountdownTimer";
import { Button, Card, Image } from "@/components/Shared/UI";
import { APP_NAME, APP_URL, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Link } from "react-router";

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
        <div className="font-bold font-mono text-lg">
          <CountdownTimer targetDate="2024-11-07T00:59:00+00:00" />
        </div>
        <div>
          <Link
            className="font-bold underline"
            to={`${APP_URL}/gitcoin`}
            target="_blank"
          >
            <Button>Contribute now</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Gitcoin;
