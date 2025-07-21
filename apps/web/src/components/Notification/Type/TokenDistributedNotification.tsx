import { GiftIcon } from "@heroicons/react/24/outline";
import type { TokenDistributedNotificationFragment } from "@hey/indexer";

interface TokenDistributedNotificationProps {
  notification: TokenDistributedNotificationFragment;
}

const TokenDistributedNotification = ({
  notification
}: TokenDistributedNotificationProps) => {
  const amount = notification.amount;

  return (
    <div className="flex items-center space-x-3">
      <GiftIcon className="size-6" />
      <div>
        You have received {amount.value} {amount.asset.symbol}
      </div>
    </div>
  );
};

export default TokenDistributedNotification;
