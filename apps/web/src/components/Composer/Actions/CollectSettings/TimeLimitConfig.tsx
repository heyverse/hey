import { ClockIcon } from "@heroicons/react/24/outline";
import type { CollectActionType } from "@hey/types/hey";
import { motion } from "motion/react";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { RangeSlider } from "@/components/Shared/UI";
import formatDate from "@/helpers/datetime/formatDate";
import getNumberOfDaysFromDate from "@/helpers/datetime/getNumberOfDaysFromDate";
import getTimeAddedNDay from "@/helpers/datetime/getTimeAddedNDay";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { EXPANSION_EASE } from "@/variants";

interface TimeLimitConfigProps {
  setCollectType: (data: CollectActionType) => void;
}

const TimeLimitConfig = ({ setCollectType }: TimeLimitConfigProps) => {
  const { collectAction } = useCollectActionStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Limit collecting to specific period of time"
        heading="Time limit"
        icon={<ClockIcon className="size-5" />}
        on={Boolean(collectAction.endsAt)}
        setOn={() =>
          setCollectType({
            endsAt: collectAction.endsAt ? null : getTimeAddedNDay(1)
          })
        }
      />
      {collectAction.endsAt ? (
        <motion.div
          animate="visible"
          className="mt-4 ml-8 space-y-2 text-sm"
          initial="hidden"
          transition={{ duration: 0.2, ease: EXPANSION_EASE }}
          variants={{
            hidden: { height: 0, opacity: 0, y: -20 },
            visible: { height: "auto", opacity: 1, y: 0 }
          }}
        >
          <div>
            Number of days -{" "}
            <b>
              {formatDate(collectAction.endsAt, "MMM d, yyyy - hh:mm:ss aa")}
            </b>
          </div>
          <RangeSlider
            defaultValue={[
              getNumberOfDaysFromDate(new Date(collectAction.endsAt))
            ]}
            displayValue={getNumberOfDaysFromDate(
              new Date(collectAction.endsAt)
            ).toString()}
            max={100}
            min={1}
            onValueChange={(value) =>
              setCollectType({ endsAt: getTimeAddedNDay(Number(value[0])) })
            }
            showValueInThumb
          />
        </motion.div>
      ) : null}
    </div>
  );
};

export default TimeLimitConfig;
