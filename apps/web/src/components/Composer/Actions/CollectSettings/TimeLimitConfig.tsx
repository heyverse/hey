import { ClockIcon } from "@heroicons/react/24/outline";
import type { CollectActionType } from "@hey/types/hey";
import dayjs from "dayjs";
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
              : dayjs().add(1, "day").toISOString()
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
              {dayjs(collectAction.endsAt).format("MMM D, YYYY - h:mm:ss A")}
            </b>
          </div>
          <RangeSlider
            defaultValue={[dayjs(collectAction.endsAt).diff(dayjs(), "day")]}
            displayValue={dayjs(collectAction.endsAt)
              .diff(dayjs(), "day")
              .toString()}
            max={100}
            min={1}
            onValueChange={(value) =>
              setCollectType({
                endsAt: dayjs().add(Number(value[0]), "day").toISOString()
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
