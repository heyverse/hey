import LicensePicker from "@/components/Composer/LicensePicker";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Button } from "@/components/Shared/UI";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { usePostLicenseStore } from "@/store/non-persisted/post/usePostLicenseStore";
import { EXPANSION_EASE } from "@/variants";
import type { CollectActionType } from "@hey/types/hey";
import { motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import { isAddress } from "viem";
import AmountConfig from "./AmountConfig";
import CollectLimitConfig from "./CollectLimitConfig";
import FollowersConfig from "./FollowersConfig";
import SplitConfig from "./SplitConfig";
import TimeLimitConfig from "./TimeLimitConfig";

interface CollectFormProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CollectForm = ({ setShowModal }: CollectFormProps) => {
  const { collectAction, setCollectAction, reset } = useCollectActionStore();
  const { setLicense } = usePostLicenseStore();

  const recipients = collectAction.payToCollect?.recipients || [];
  const splitTotal = recipients.reduce((acc, { percent }) => acc + percent, 0);

  const validationChecks = {
    hasEmptyRecipients: recipients.some(({ address }) => !address),
    hasInvalidEthAddress: recipients.some(
      ({ address }) => address && !isAddress(address)
    ),
    hasZeroSplits: recipients.some(({ percent }) => percent === 0),
    hasImproperSplits: recipients.length > 1 && splitTotal !== 100,
    isRecipientsDuplicated:
      new Set(recipients.map(({ address }) => address)).size !==
      recipients.length
  };

  const setCollectType = (data: CollectActionType) => {
    setCollectAction({ ...collectAction, ...data });
  };

  const toggleCollect = () => {
    if (collectAction.enabled) {
      setLicense(null);
      reset();
    } else {
      setCollectType({ enabled: true });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setLicense(null);
    reset();
  };

  return (
    <>
      <div className="p-5">
        <ToggleWithHelper
          description="This post can be collected"
          heading="Enable Collect"
          on={collectAction.enabled || false}
          setOn={toggleCollect}
        />
      </div>
      <div className="divider" />
      {collectAction.enabled && (
        <>
          <motion.div
            className="m-5 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, height: 0, y: -20 },
              visible: { opacity: 1, height: "auto", y: 0 }
            }}
            transition={{ duration: 0.2, ease: EXPANSION_EASE }}
          >
            <AmountConfig setCollectType={setCollectType} />
            {collectAction.payToCollect?.amount.value && (
              <SplitConfig
                isRecipientsDuplicated={validationChecks.isRecipientsDuplicated}
                setCollectType={setCollectType}
              />
            )}
            <CollectLimitConfig setCollectType={setCollectType} />
            <TimeLimitConfig setCollectType={setCollectType} />
            <FollowersConfig setCollectType={setCollectType} />
          </motion.div>
          <div className="divider" />
          <div className="m-5">
            <LicensePicker />
          </div>
          <div className="divider" />
        </>
      )}
      <div className="flex space-x-2 p-5">
        <Button className="ml-auto" onClick={handleClose} outline>
          {collectAction.enabled ? "Reset" : "Cancel"}
        </Button>
        <Button
          disabled={
            (Number.parseFloat(
              collectAction.payToCollect?.amount.value as string
            ) <= 0 &&
              collectAction.enabled) ||
            Object.values(validationChecks).some(Boolean)
          }
          onClick={() => setShowModal(false)}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default CollectForm;
