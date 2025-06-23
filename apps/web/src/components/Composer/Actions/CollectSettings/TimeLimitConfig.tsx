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
          className="mt-4 ml-8 space-y-2 text-sm"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, height: 0, y: -20 },
            visible: { opacity: 1, height: "auto", y: 0 }
          }}
          transition={{ duration: 0.2, ease: EXPANSION_EASE }}
        >
          <div>
            Number of days -{" "}
            <b>
              {formatDate(collectAction.endsAt, "MMM D, YYYY - hh:mm:ss A")}
            </b>
          </div>
          <RangeSlider
            showValueInThumb
            min={1}
            max={100}
            displayValue={getNumberOfDaysFromDate(
              new Date(collectAction.endsAt)
            ).toString()}
            defaultValue={[
              getNumberOfDaysFromDate(new Date(collectAction.endsAt))
            ]}
            onValueChange={(value) =>
              setCollectType({ endsAt: getTimeAddedNDay(Number(value[0])) })
            }
          />
        </motion.div>
      ) : null}
    </div>
  );
};

export default TimeLimitConfig;
