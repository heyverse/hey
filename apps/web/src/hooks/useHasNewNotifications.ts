import { useNotificationsQuery } from "@hey/indexer";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useNotificationStore } from "@/store/persisted/useNotificationStore";

const useHasNewNotifications = () => {
  const { currentAccount } = useAccountStore();
  const { lastSeenNotificationId } = useNotificationStore();

  const { data } = useNotificationsQuery({
    skip: !currentAccount,
    variables: { request: {} }
  });

  const latestId = data?.notifications?.items?.[0]?.id;
  if (!latestId || !currentAccount) {
    return false;
  }

  return latestId !== lastSeenNotificationId;
};

export default useHasNewNotifications;
