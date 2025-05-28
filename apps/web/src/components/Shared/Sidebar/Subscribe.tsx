import { Button, Card, H5 } from "@/components/Shared/UI";
import hasSubscribed from "@/helpers/hasSubscribed";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Subscribe = () => {
  const { currentAccount } = useAccountStore();

  if (currentAccount && hasSubscribed(currentAccount)) {
    return null;
  }

  return (
    <Card className="relative space-y-2">
      <XCircleIcon className="absolute top-3 right-3 size-5 cursor-pointer text-gray-400 hover:text-gray-600" />
      <div className="m-5">
        <div className="flex items-center gap-2">
          <CheckBadgeIcon className="size-5 text-brand-500" />
          <H5>Subscribe to Hey Pro</H5>
        </div>
        <div className="mb-5 text-sm">
          Get badge and access to exclusive features.
        </div>
        <Button className="w-full" outline>
          Subscribe now
        </Button>
      </div>
    </Card>
  );
};

export default Subscribe;
