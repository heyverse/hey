import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AccountFragment } from "@hey/indexer";
import Link from "next/link";
import { NotificationAccountName } from "./Account";

interface AggregatedNotificationTitleProps {
  firstAccount: AccountFragment;
  linkToType: string;
  text: string;
  type?: string;
}

const AggregatedNotificationTitle = ({
  firstAccount,
  linkToType,
  text,
  type
}: AggregatedNotificationTitleProps) => {
  return (
    <div>
      <NotificationAccountName account={firstAccount} />
      <span> {text} </span>
      {type && (
        <Link
          className="outline-none hover:underline focus:underline"
          href={linkToType}
          onClick={stopEventPropagation}
        >
          {type.toLowerCase()}
        </Link>
      )}
    </div>
  );
};

export default AggregatedNotificationTitle;
