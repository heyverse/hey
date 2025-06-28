import type { CollectActionType } from "@hey/types/hey";
import { motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import LicensePicker from "@/components/Composer/LicensePicker";
import ProFeatureNotice from "@/components/Shared/ProFeatureNotice";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Button, H6 } from "@/components/Shared/UI";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { usePostLicenseStore } from "@/store/non-persisted/post/usePostLicenseStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { EXPANSION_EASE } from "@/variants";
import AmountConfig from "./AmountConfig";
import CollectLimitConfig from "./CollectLimitConfig";
import { CollectActionSchema } from "./collectSchema";
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

  const parsedCollect = CollectActionSchema.safeParse(collectAction);
  const validationErrors = parsedCollect.success
    ? []
    : parsedCollect.error.issues.map((issue) => issue.message);

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
            {currentAccount?.hasSubscribed ? (
              <>
                {collectAction.payToCollect?.erc20?.value && (
                  <SplitConfig
                    setCollectType={setCollectType}
                    validationErrors={validationErrors}
                  />
                )}
                <CollectLimitConfig setCollectType={setCollectType} />
                <TimeLimitConfig setCollectType={setCollectType} />
                <FollowersConfig setCollectType={setCollectType} />
              </>
            ) : (
              <ProFeatureNotice
                className="mt-5"
                feature="advanced collect settings"
              />
            )}
          </motion.div>
          {currentAccount?.hasSubscribed && (
            <>
              <div className="divider" />
              <div className="m-5">
                <LicensePicker />
              </div>
            </>
          )}
          <div className="divider" />
        </>
      )}
      {validationErrors.length > 0 && (
        <H6 className="px-5 text-red-500">{validationErrors[0]}</H6>
      )}
      <div className="flex space-x-2 p-5">
        <Button className="ml-auto" onClick={handleClose} outline>
          {collectAction.enabled ? "Reset" : "Cancel"}
        </Button>
        <Button
          disabled={!parsedCollect.success}
          onClick={() => setShowModal(false)}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default CollectForm;
