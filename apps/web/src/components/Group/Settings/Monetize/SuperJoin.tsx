import {
  DEFAULT_COLLECT_TOKEN,
  IS_MAINNET,
  STATIC_IMAGES_URL,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import {
  type GroupFragment,
  type GroupRules,
  GroupRuleType,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
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
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";

interface SuperJoinProps {
  group: GroupFragment;
}

const SuperJoin = ({ group }: SuperJoinProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();
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

  const onCompleted = async (hash: string) => {
    await waitForTransactionToComplete(hash);
    location.reload();
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [updateGroupRules] = useUpdateGroupRulesMutation({
    onCompleted: async ({ updateGroupRules }) => {
      if (updateGroupRules.__typename === "UpdateGroupRulesResponse") {
        return onCompleted(updateGroupRules.hash);
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: updateGroupRules
      });
    },
    onError
  });

  const handleUpdateRule = async (remove: boolean) => {
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
                        erc20: {
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
          className="no-spinner"
          label="Amount"
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="1"
          prefix={
            <Tooltip
              content={`Payable in ${WRAPPED_NATIVE_TOKEN_SYMBOL}`}
              placement="top"
            >
              <Image
                alt={WRAPPED_NATIVE_TOKEN_SYMBOL}
                className="size-5 rounded-full"
                src={`${STATIC_IMAGES_URL}/tokens/${
                  IS_MAINNET ? "gho.svg" : "grass.svg"
                }`}
              />
            </Tooltip>
          }
          ref={inputRef}
          type="number"
          value={amount}
        />
        <div className="flex justify-end space-x-2">
          {simplePaymentRule && (
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={() => handleUpdateRule(true)}
              outline
            >
              Remove
            </Button>
          )}
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
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
