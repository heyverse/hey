import { Card, H5 } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { APP_NAME } from "@hey/data/constants";
import { Link } from "react-router";

interface StatusProps {
  finished: boolean;
  title: string;
}

const Status = ({ finished, title }: StatusProps) => (
  <div className="flex items-center space-x-1.5">
    {finished ? (
      <CheckCircleIcon className="size-5" />
    ) : (
      <MinusCircleIcon className="size-5" />
    )}
    <div className="text-gray-500 dark:text-gray-200">{title}</div>
  </div>
);

const SetAccount = () => {
  const { currentAccount } = useAccountStore();

  const doneSetup =
    Boolean(currentAccount?.metadata?.name) &&
    Boolean(currentAccount?.metadata?.bio) &&
    Boolean(currentAccount?.metadata?.picture);

  if (doneSetup) {
    return null;
  }

  return (
    <Card className="mb-4 space-y-4 p-5">
      <H5>Setup your {APP_NAME} account</H5>
      <div className="space-y-1 text-sm leading-5">
        <Status
          finished={Boolean(currentAccount?.metadata?.name)}
          title="Set account name"
        />
        <Status
          finished={Boolean(currentAccount?.metadata?.bio)}
          title="Set account bio"
        />
        <Status
          finished={Boolean(currentAccount?.metadata?.picture)}
          title="Set your avatar"
        />
      </div>
      <div className="font-bold">
        <Link to="/settings">Update account now</Link>
      </div>
    </Card>
  );
};

export default SetAccount;
