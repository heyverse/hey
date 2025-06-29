import { ClockIcon } from "@heroicons/react/24/outline";
import type { CollectActionType } from "@hey/types/hey";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { motion } from "motion/react";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { RangeSlider } from "@/components/Shared/UI";
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
            endsAt: collectAction.endsAt
              ? null
              : addDays(new Date(), 1).toISOString()
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
              {format(
                new Date(collectAction.endsAt),
                "MMM d, yyyy - hh:mm:ss aa"
              )}
            </b>
          </div>
          <RangeSlider
            defaultValue={[
              differenceInCalendarDays(
                new Date(collectAction.endsAt),
                new Date()
              )
            ]}
            displayValue={differenceInCalendarDays(
              new Date(collectAction.endsAt),
              new Date()
            ).toString()}
            max={100}
            min={1}
            onValueChange={(value) =>
              setCollectType({
                endsAt: addDays(new Date(), Number(value[0])).toISOString()
              })
            }
            showValueInThumb
          />
        </motion.div>
      ) : null}
    </div>
  );
};

export default TimeLimitConfig;
