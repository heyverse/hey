import { Button } from "@/components/Shared/UI";
import {
  getMembershipApprovalDetails,
  getSimplePaymentDetails
} from "@/helpers/rules";
import { useSuperJoinModalStore } from "@/store/non-persisted/modal/useSuperJoinModalStore";
import type { GroupFragment, GroupRules } from "@hey/indexer";
import Join from "./Join";

interface JoinWithRulesCheckProps {
  group: GroupFragment;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const JoinWithRulesCheck = ({
  group,
  setJoined,
  small
}: JoinWithRulesCheckProps) => {
  const { setShowSuperJoinModal } = useSuperJoinModalStore();
  const { assetAddress: requiredSimplePayment } = getSimplePaymentDetails(
    group.rules as GroupRules
  );
  const requiresMembershipApproval = getMembershipApprovalDetails(
    group.rules as GroupRules
  );

  if (requiredSimplePayment) {
    return (
      <Button
        aria-label="Super Join"
        onClick={() => setShowSuperJoinModal(true, group)}
        outline
        size={small ? "sm" : "md"}
      >
        Super Join
      </Button>
    );
  }

  return (
    <Join
      group={group}
      setJoined={setJoined}
      small={small}
      title={requiresMembershipApproval ? "Request to join" : "Join"}
    />
  );
};

export default JoinWithRulesCheck;
