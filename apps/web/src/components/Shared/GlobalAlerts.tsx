import { useBlockAlertStore } from "@/store/non-persisted/alert/useBlockAlertStore";
import { useMuteAlertStore } from "@/store/non-persisted/alert/useMuteAlertStore";
import BlockOrUnblockAccount from "./Alert/BlockOrUnblockAccount";
import DeletePost from "./Alert/DeletePost";
import MuteOrUnmuteAccount from "./Alert/MuteOrUnmuteAccount";

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
