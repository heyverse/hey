import BlockOrUnblockAccount from "@/components/Shared/Alert/BlockOrUnblockAccount";
import DeletePost from "@/components/Shared/Alert/DeletePost";
import MuteOrUnmuteAccount from "@/components/Shared/Alert/MuteOrUnmuteAccount";
import { useBlockAlertStore } from "@/store/non-persisted/alert/useBlockAlertStore";
import { useMuteAlertStore } from "@/store/non-persisted/alert/useMuteAlertStore";

const GlobalAlerts = () => {
  const { mutingOrUnmutingAccount } = useMuteAlertStore();
  const { blockingOrUnblockingAccount } = useBlockAlertStore();

  return (
    <>
      <DeletePost />
      {blockingOrUnblockingAccount && <BlockOrUnblockAccount />}
      {mutingOrUnmutingAccount && <MuteOrUnmuteAccount />}
    </>
  );
};

export default GlobalAlerts;
