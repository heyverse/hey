import { Button } from "@/components/Shared/UI";
import { getSimplePaymentDetails } from "@/helpers/rules";
import { useSuperFollowModalStore } from "@/store/non-persisted/modal/useSuperFollowModalStore";
import type { AccountFollowRules, AccountFragment } from "@hey/indexer";
import Follow from "./Follow";

interface FollowWithRulesCheckProps {
  buttonClassName: string;
  account: AccountFragment;
  small: boolean;
}

const FollowWithRulesCheck = ({
  buttonClassName,
  account,
  small
}: FollowWithRulesCheckProps) => {
  const { setShowSuperFollowModal } = useSuperFollowModalStore();
  const { assetAddress: requiredSimplePayment } = getSimplePaymentDetails(
    account.rules as AccountFollowRules
  );

  if (requiredSimplePayment) {
    return (
      <Button
        aria-label="Super Follow"
        onClick={() => setShowSuperFollowModal(true, account)}
        className={buttonClassName}
        outline
        size={small ? "sm" : "md"}
      >
        Super Follow
      </Button>
    );
  }

  return (
    <Follow account={account} buttonClassName={buttonClassName} small={small} />
  );
};

export default FollowWithRulesCheck;
