import type { ReactNode } from "react";
import { memo } from "react";
import humanize from "@/helpers/humanize";
import { Card, H4 } from "./UI";

interface NumberedStatsProps {
  count?: string;
  name: ReactNode;
  suffix?: string;
}

const NumberedStat = ({ count, name, suffix }: NumberedStatsProps) => {
  return (
    <Card className="p-5" forceRounded>
      <div>{name}</div>
      <H4 className="tracking-wide">
        {humanize(Number(count))} <span className="text-sm">{suffix}</span>
      </H4>
    </Card>
  );
};

export default memo(NumberedStat);
