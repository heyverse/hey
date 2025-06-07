import splitNumber from "@/helpers/splitNumber";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { CollectActionType } from "@hey/types/hey";
import { useCallback, useState } from "react";

const useSplitConfig = (setCollectType: (data: CollectActionType) => void) => {
  const { currentAccount } = useAccountStore();
  const { collectAction } = useCollectActionStore((state) => state);

  const currentAddress = currentAccount?.address || "";
  const recipients = collectAction.payToCollect?.recipients || [];
  const [isToggleOn, setIsToggleOn] = useState(
    recipients.length > 1 ||
      (recipients.length === 1 && recipients[0].address !== currentAddress)
  );
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.percent, 0);

  const handleSplitEvenly = useCallback(() => {
    const equalSplits = splitNumber(100, recipients.length);
    const splits = recipients.map((recipient, i) => ({
      address: recipient.address,
      percent: equalSplits[i]
    }));
    if (!collectAction.payToCollect) return;
    setCollectType({
      payToCollect: {
        ...collectAction.payToCollect,
        recipients: [...splits]
      }
    });
  }, [recipients, collectAction.payToCollect, setCollectType]);

  const onChangeRecipientOrPercent = useCallback(
    (index: number, value: string, type: "address" | "percent") => {
      const getRecipients = (val: string) =>
        recipients.map((recipient, i) => {
          if (i === index) {
            return {
              ...recipient,
              [type]: type === "address" ? val : Number.parseInt(val)
            };
          }
          return recipient;
        });

      if (!collectAction.payToCollect) return;
      setCollectType({
        payToCollect: {
          ...collectAction.payToCollect,
          recipients: getRecipients(value)
        }
      });
    },
    [recipients, collectAction.payToCollect, setCollectType]
  );

  const updateRecipient = useCallback(
    (index: number, value: string) => {
      onChangeRecipientOrPercent(index, value, "address");
    },
    [onChangeRecipientOrPercent]
  );

  const handleRemoveRecipient = useCallback(
    (index: number) => {
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
    },
    [recipients, collectAction.payToCollect, setCollectType, currentAddress]
  );

  const toggleSplit = useCallback(() => {
    if (!collectAction.payToCollect) return;
    setCollectType({
      payToCollect: {
        ...collectAction.payToCollect,
        recipients: [{ address: currentAddress, percent: 100 }]
      }
    });
    setIsToggleOn(!isToggleOn);
  }, [collectAction.payToCollect, setCollectType, isToggleOn, currentAddress]);

  return {
    recipients,
    isToggleOn,
    setIsToggleOn,
    splitTotal,
    handleSplitEvenly,
    onChangeRecipientOrPercent,
    updateRecipient,
    handleRemoveRecipient,
    toggleSplit
  };
};

export default useSplitConfig;
