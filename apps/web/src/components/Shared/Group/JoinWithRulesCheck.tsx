import type { GroupFragment, GroupRules } from "@hey/indexer";
import { Button } from "@/components/Shared/UI";
import { getSimplePaymentDetails } from "@/helpers/rules";
import { useSuperJoinModalStore } from "@/store/non-persisted/modal/useSuperJoinModalStore";
import Join from "./Join";

interface JoinWithRulesCheckProps {
  group: GroupFragment;
  small: boolean;
}

const JoinWithRulesCheck = ({ group, small }: JoinWithRulesCheckProps) => {
  const { setShowSuperJoinModal } = useSuperJoinModalStore();
  const { assetAddress: requiredSimplePayment } = getSimplePaymentDetails(
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
      small={small}
      title={group.membershipApprovalEnabled ? "Request to join" : "Join"}
    />
  );
};

export default JoinWithRulesCheck;
