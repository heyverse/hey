import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  type GroupFragment,
  GroupRuleType,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";

interface ApprovalRuleProps {
  group: GroupFragment;
}

const ApprovalRule = ({ group }: ApprovalRuleProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const approvalRule = [...group.rules.required, ...group.rules.anyOf].find(
    (rule) => rule.type === GroupRuleType.MembershipApproval
  );
  const [isApprovalRuleEnabled, setIsApprovalRuleEnabled] = useState(
    approvalRule !== undefined
  );

  const onCompleted = () => {
    setIsSubmitting(false);
    setIsApprovalRuleEnabled(!isApprovalRuleEnabled);
    toast.success("Approval rule updated");
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [updateGroupRules] = useUpdateGroupRulesMutation({
    onCompleted: async ({ updateGroupRules }) => {
      if (updateGroupRules.__typename === "UpdateGroupRulesResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: updateGroupRules
      });
    },
    onError
  });

  const handleUpdateRule = () => {
    setIsSubmitting(true);

    return updateGroupRules({
      variables: {
        request: {
          group: group.address,
          ...(isApprovalRuleEnabled
            ? { toRemove: [approvalRule?.id] }
            : {
                toAdd: {
                  required: [{ membershipApprovalRule: { enable: true } }]
                }
              })
        }
      }
    });
  };

  return (
    <div className="m-5">
      <ToggleWithHelper
        description="Toggle to require approval for new members"
        disabled={isSubmitting}
        heading="Enable Membership Approval"
        icon={<PlusCircleIcon className="size-5" />}
        on={isApprovalRuleEnabled}
        setOn={handleUpdateRule}
      />
    </div>
  );
};

export default ApprovalRule;
