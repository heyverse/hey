import { SparklesIcon } from "@heroicons/react/24/outline";
import type { TimelineItemFragment } from "@hey/indexer";
import { Fragment } from "react";
import Accounts from "@/components/Shared/Account/Accounts";

interface CombinedProps {
  timelineItem: TimelineItemFragment;
}

const Combined = ({ timelineItem }: CombinedProps) => {
  const { reposts } = timelineItem;

  const repostsLength = reposts.length;

  const getAllAccounts = () => {
    let accounts = reposts.map((event) => event.author);
    accounts = accounts.filter(
      (account, index, self) =>
        index === self.findIndex((t) => t.address === account.address)
    );
    return accounts;
  };

  const actionArray = [];
  if (repostsLength) {
    actionArray.push("reposted");
  }

  return (
    <div className="flex flex-wrap items-center space-x-1 pb-4 text-[13px] text-gray-500 leading-6 dark:text-gray-200">
      <SparklesIcon className="size-4" />
      <Accounts accounts={getAllAccounts()} />
      <div className="flex items-center space-x-1">
        {actionArray.map((action, index) => (
          <Fragment key={action}>
            <span>{action}</span>
            {index < actionArray.length - 2 && <span>, </span>}
            {index === actionArray.length - 2 && <span>and</span>}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Combined;
