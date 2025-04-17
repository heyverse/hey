import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Input } from "@/components/Shared/UI";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { EXPANSION_EASE } from "@/variants";
import { StarIcon } from "@heroicons/react/24/outline";
import type { CollectActionType } from "@hey/types/hey";
import { motion } from "motion/react";

interface CollectLimitConfigProps {
  setCollectType: (data: CollectActionType) => void;
}

const CollectLimitConfig = ({ setCollectType }: CollectLimitConfigProps) => {
  const { collectAction } = useCollectActionStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Make collects limited edition"
        heading="Exclusive content"
        icon={<StarIcon className="size-5" />}
        on={Boolean(collectAction.collectLimit)}
        setOn={() =>
          setCollectType({
            collectLimit: collectAction.collectLimit ? null : 1
          })
        }
      />
      {collectAction.collectLimit ? (
        <motion.div
          className="mt-4 ml-8 text-sm"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, height: 0, y: -20 },
            visible: { opacity: 1, height: "auto", y: 0 }
          }}
          transition={{ duration: 0.2, ease: EXPANSION_EASE }}
        >
          <Input
            label="Collect limit"
            max="100000"
            min="1"
            onChange={(event) => {
              setCollectType({
                collectLimit: Number(event.target.value || 1)
              });
            }}
            placeholder="5"
            type="number"
            value={collectAction.collectLimit}
          />
        </motion.div>
      ) : null}
    </div>
  );
};

export default CollectLimitConfig;
