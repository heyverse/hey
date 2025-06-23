import { MotionConfig, motion } from "motion/react";
import { memo, type ReactNode } from "react";
import cn from "@/helpers/cn";

interface TabsProps {
  tabs: { name: string; type: string; suffix?: ReactNode }[];
  active: string;
  setActive: (type: string) => void;
  layoutId: string;
  className?: string;
}

const Tabs = ({ tabs, active, setActive, layoutId, className }: TabsProps) => {
  return (
    <MotionConfig transition={{ bounce: 0, duration: 0.4, type: "spring" }}>
      <motion.ul
        className={cn("mb-0 flex list-none flex-wrap gap-3", className)}
        layout
      >
        {tabs.map((tab) => (
          <motion.li
            className="relative cursor-pointer px-3 py-1.5 text-sm outline-hidden transition-colors"
            key={tab.type}
            layout
            onClick={() => setActive(tab.type)}
            tabIndex={0}
          >
            {active === tab.type ? (
              <motion.div
                className="absolute inset-0 rounded-lg bg-gray-300 dark:bg-gray-300/20"
                layoutId={layoutId}
              />
            ) : null}
            <span className="relative flex items-center gap-2 text-inherit">
              {tab.name}
              {tab.suffix}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </MotionConfig>
  );
};

export default memo(Tabs);
