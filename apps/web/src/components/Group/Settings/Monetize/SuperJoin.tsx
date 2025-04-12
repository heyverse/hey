import BackButton from "@/components/Shared/BackButton";
import {
  Button,
  Card,
  CardHeader,
  Image,
  Input,
  Tooltip
} from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { getSimplePaymentDetails } from "@/helpers/rules";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import {
  DEFAULT_COLLECT_TOKEN,
  IS_MAINNET,
  STATIC_IMAGES_URL,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import {
  type GroupFragment,
  GroupRuleType,
  type GroupRules,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import { type RefObject, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SuperJoinProps {
  group: GroupFragment;
}

const SuperJoin = ({ group }: SuperJoinProps) => {
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);

  const simplePaymentRule = [
    ...group.rules.required,
    ...group.rules.anyOf
  ].find((rule) => rule.type === GroupRuleType.SimplePayment);
  const { amount: simplePaymentAmount } = getSimplePaymentDetails(
    group.rules as GroupRules
  );

  useEffect(() => {
    setAmount(simplePaymentAmount || 0);
  }, [simplePaymentAmount]);

  const onCompleted = (hash: string) => {
    pollTransactionStatus(hash, () => location.reload());
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [updateGroupRules] = useUpdateGroupRulesMutation({
    onCompleted: async ({ updateGroupRules }) => {
      if (updateGroupRules.__typename === "UpdateGroupRulesResponse") {
        return onCompleted(updateGroupRules.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: updateGroupRules,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleUpdateRule = async (remove: boolean) => {
    if (isSuspended) return toast.error(Errors.Suspended);

    setIsSubmitting(true);

    return await updateGroupRules({
      variables: {
        request: {
          group: group.address,
          ...(remove
            ? { toRemove: [simplePaymentRule?.id] }
            : {
                ...(simplePaymentRule && {
                  toRemove: [simplePaymentRule?.id]
                }),
                toAdd: {
                  required: [
                    {
                      simplePaymentRule: {
                        cost: {
                          currency: DEFAULT_COLLECT_TOKEN,
                          value: amount.toString()
                        },
                        recipient: group.owner
                      }
                    }
                  ]
                }
              })
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader
        icon={<BackButton path={`/g/${group.address}/settings`} />}
        title="Super Join"
      />
      <div className="m-5 flex flex-col gap-y-4">
        <Input
          label="Amount"
          placeholder="1"
          prefix={
            <Tooltip
              content={`Payable in ${WRAPPED_NATIVE_TOKEN_SYMBOL}`}
              placement="top"
            >
              <Image
                className="size-5"
                src={`${STATIC_IMAGES_URL}/tokens/${
                  IS_MAINNET ? "gho.svg" : "grass.svg"
                }`}
                alt={WRAPPED_NATIVE_TOKEN_SYMBOL}
              />
            </Tooltip>
          }
          className="no-spinner"
          ref={inputRef}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="flex justify-end space-x-2">
          {simplePaymentRule && (
            <Button
              disabled={isSubmitting}
              onClick={() => handleUpdateRule(true)}
              outline
            >
              Remove
            </Button>
          )}
          <Button
            disabled={isSubmitting}
            onClick={() => handleUpdateRule(false)}
          >
            Update
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SuperJoin;
