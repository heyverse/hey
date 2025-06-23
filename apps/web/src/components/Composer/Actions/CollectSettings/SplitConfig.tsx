import {
  ArrowsRightLeftIcon,
  PlusIcon,
  UsersIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { ADDRESS_PLACEHOLDER } from "@hey/data/constants";
import type { CollectActionType } from "@hey/types/hey";
import { motion } from "motion/react";
import { useState } from "react";
import { isAddress } from "viem";
import SearchAccounts from "@/components/Shared/Account/SearchAccounts";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Button, H6, Input } from "@/components/Shared/UI";
import splitNumber from "@/helpers/splitNumber";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { EXPANSION_EASE } from "@/variants";

interface SplitConfigProps {
  isRecipientsDuplicated: boolean;
  setCollectType: (data: CollectActionType) => void;
}

const SplitConfig = ({
  isRecipientsDuplicated,
  setCollectType
}: SplitConfigProps) => {
  const { currentAccount } = useAccountStore();
  const { collectAction } = useCollectActionStore((state) => state);

  const currentAddress = currentAccount?.address || "";
  const recipients = collectAction.payToCollect?.recipients || [];
  const [isToggleOn, setIsToggleOn] = useState(
    recipients.length > 1 ||
      (recipients.length === 1 && recipients[0].address !== currentAddress)
  );
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.percent, 0);

  const handleSplitEvenly = () => {
    const equalSplits = splitNumber(100, recipients.length);
    const splits = recipients.map((recipient, i) => {
      return {
        address: recipient.address,
        percent: equalSplits[i]
      };
    });
    if (!collectAction.payToCollect) return;
    setCollectType({
      payToCollect: {
        ...collectAction.payToCollect,
        recipients: [...splits]
      }
    });
  };

  const onChangeRecipientOrPercent = (
    index: number,
    value: string,
    type: "address" | "percent"
  ) => {
    const getRecipients = (value: string) => {
      return recipients.map((recipient, i) => {
        if (i === index) {
          return {
            ...recipient,
            [type]: type === "address" ? value : Number.parseInt(value)
          };
        }
        return recipient;
      });
    };

    if (!collectAction.payToCollect) return;
    setCollectType({
      payToCollect: {
        ...collectAction.payToCollect,
        recipients: getRecipients(value)
      }
    });
  };

  const updateRecipient = (index: number, value: string) => {
    onChangeRecipientOrPercent(index, value, "address");
  };

  const handleRemoveRecipient = (index: number) => {
    const updatedRecipients = recipients.filter((_, i) => i !== index);
    if (updatedRecipients.length) {
      if (!collectAction.payToCollect) return;
      setCollectType({
        payToCollect: {
          ...collectAction.payToCollect,
          recipients: updatedRecipients
        }
      });
    } else {
      if (!collectAction.payToCollect) return;
      setCollectType({
        payToCollect: {
          ...collectAction.payToCollect,
          recipients: [{ address: currentAddress, percent: 100 }]
        }
      });
      setIsToggleOn(false);
    }
  };

  const toggleSplit = () => {
    if (!collectAction.payToCollect) return;
    setCollectType({
      payToCollect: {
        ...collectAction.payToCollect,
        recipients: [{ address: currentAddress, percent: 100 }]
      }
    });
    setIsToggleOn(!isToggleOn);
  };

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Set multiple recipients for the collect fee"
        heading="Split revenue"
        icon={<UsersIcon className="size-5" />}
        on={isToggleOn}
        setOn={toggleSplit}
      />
      {isToggleOn ? (
        <motion.div
          animate="visible"
          className="mt-4 ml-8 space-y-3"
          initial="hidden"
          transition={{ duration: 0.2, ease: EXPANSION_EASE }}
          variants={{
            hidden: { height: 0, opacity: 0, y: -20 },
            visible: { height: "auto", opacity: 1, y: 0 }
          }}
        >
          <div className="space-y-2">
            {recipients.map((recipient, index) => (
              <H6
                className="flex items-center space-x-2 font-normal"
                key={index}
              >
                <SearchAccounts
                  error={
                    recipient.address.length > 0 &&
                    !isAddress(recipient.address)
                  }
                  hideDropdown={isAddress(recipient.address)}
                  onAccountSelected={(account) =>
                    updateRecipient(index, account.owner)
                  }
                  onChange={(event) =>
                    updateRecipient(index, event.target.value)
                  }
                  placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
                  value={recipient.address}
                />
                <div className="w-1/3">
                  <Input
                    iconRight="%"
                    max="100"
                    min="1"
                    onChange={(event) =>
                      onChangeRecipientOrPercent(
                        index,
                        event.target.value,
                        "percent"
                      )
                    }
                    placeholder="5"
                    type="number"
                    value={recipient.percent}
                  />
                </div>
                <button
                  onClick={() => handleRemoveRecipient(index)}
                  type="button"
                >
                  <XCircleIcon className="size-5" />
                </button>
              </H6>
            ))}
          </div>
          <div className="flex items-center justify-between">
            {recipients.length >= 4 ? (
              <div />
            ) : (
              <Button
                icon={<PlusIcon className="size-3" />}
                onClick={() => {
                  if (!collectAction.payToCollect) return;
                  setCollectType({
                    payToCollect: {
                      ...collectAction.payToCollect,
                      recipients: [...recipients, { address: "", percent: 0 }]
                    }
                  });
                }}
                outline
                size="sm"
              >
                Add recipient
              </Button>
            )}
            <Button
              icon={<ArrowsRightLeftIcon className="size-3" />}
              onClick={handleSplitEvenly}
              outline
              size="sm"
            >
              Split evenly
            </Button>
          </div>
          {splitTotal > 100 ? (
            <H6 className="text-red-500">
              Splits cannot exceed 100%. Total: <span>{splitTotal}</span>%
            </H6>
          ) : null}
          {splitTotal < 100 ? (
            <H6 className="text-red-500">
              Splits cannot be less than 100%. Total: <span>{splitTotal}</span>%
            </H6>
          ) : null}
          {isRecipientsDuplicated ? (
            <H6 className="text-red-500">Duplicate recipient address found</H6>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
};

export default SplitConfig;
