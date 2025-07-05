import type { CollectActionType } from "@hey/types/hey";
import { motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import { isAddress } from "viem";
import LicensePicker from "@/components/Composer/LicensePicker";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Button } from "@/components/Shared/UI";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { usePostLicenseStore } from "@/store/non-persisted/post/usePostLicenseStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { EXPANSION_EASE } from "@/variants";
import AmountConfig from "./AmountConfig";
import CollectLimitConfig from "./CollectLimitConfig";
import FollowersConfig from "./FollowersConfig";
import SplitConfig from "./SplitConfig";
import TimeLimitConfig from "./TimeLimitConfig";

interface CollectFormProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CollectForm = ({ setShowModal }: CollectFormProps) => {
  const { currentAccount } = useAccountStore();
  const { collectAction, setCollectAction, reset } = useCollectActionStore();
  const { setLicense } = usePostLicenseStore();

  const recipients = collectAction.payToCollect?.recipients || [];
  const splitTotal = recipients.reduce((acc, { percent }) => acc + percent, 0);

  const validationChecks = {
    hasEmptyRecipients: recipients.some(({ address }) => !address),
    hasImproperSplits: recipients.length > 1 && splitTotal !== 100,
    hasInvalidEthAddress: recipients.some(
      ({ address }) => address && !isAddress(address)
    ),
    hasZeroSplits: recipients.some(({ percent }) => percent === 0),
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
            animate="visible"
            className="m-5 overflow-hidden"
            initial="hidden"
            transition={{ duration: 0.2, ease: EXPANSION_EASE }}
            variants={{
              hidden: { height: 0, opacity: 0, y: -20 },
              visible: { height: "auto", opacity: 1, y: 0 }
            }}
          >
            <AmountConfig setCollectType={setCollectType} />
            {collectAction.payToCollect?.erc20?.value && (
              <SplitConfig
                isRecipientsDuplicated={
                  validationChecks.isRecipientsDuplicated
                }
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
              collectAction.payToCollect?.erc20?.value as string
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
