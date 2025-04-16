import { TipIcon } from "@/components/Shared/Icons/TipIcon";
import type { AccountActionExecutedNotificationFragment } from "@hey/indexer";
import plur from "plur";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface AccountActionExecutedNotificationProps {
  notification: AccountActionExecutedNotificationFragment;
}

const AccountActionExecutedNotification = ({
  notification
}: AccountActionExecutedNotificationProps) => {
  const actions = notification.actions;
  const firstAccount =
    actions[0].__typename === "TippingAccountActionExecuted"
      ? actions[0].executedBy
      : undefined;
  const length = actions.length - 1;
  const moreThanOneAccount = length > 1;
  const type =
    actions[0].__typename === "TippingAccountActionExecuted"
      ? "tipped"
      : undefined;

  const text = moreThanOneAccount
    ? `and ${length} ${plur("other", length)} ${type} you`
    : `${type} you`;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <TipIcon className="size-6" />
        <div className="flex items-center space-x-1">
          {actions.slice(0, 10).map((action, index: number) => {
            const account =
              action.__typename === "TippingAccountActionExecuted"
                ? action.executedBy
                : undefined;

            if (!account) {
              return null;
            }

            return (
              <div key={index}>
                <NotificationAccountAvatar account={account} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="ml-9">
        {firstAccount && (
          <AggregatedNotificationTitle
            firstAccount={firstAccount}
            linkToType={`/accounts/${firstAccount.address}`}
            text={text}
          />
        )}
      </div>
    </div>
  );
};

export default AccountActionExecutedNotification;
