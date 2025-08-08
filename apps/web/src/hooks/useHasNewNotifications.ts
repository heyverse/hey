import {
  NotificationOrderBy,
  useNotificationIndicatorQuery
} from "@hey/indexer";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useNotificationStore } from "@/store/persisted/useNotificationStore";

const useHasNewNotifications = () => {
  const { currentAccount } = useAccountStore();
  const { lastSeenNotificationId } = useNotificationStore();

  const { data } = useNotificationIndicatorQuery({
    skip: !currentAccount,
    variables: { request: { orderBy: NotificationOrderBy.Default } }
  });

  const latestNotificationWithId = data?.notifications?.items?.find(
    (notification) => "id" in notification
  );
  const latestId = latestNotificationWithId?.id;

  if (!latestId || !currentAccount) {
    return false;
  }

  return latestId !== lastSeenNotificationId;
};

export default useHasNewNotifications;
