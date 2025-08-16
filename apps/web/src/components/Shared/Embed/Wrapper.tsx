import type { ReactNode } from "react";
import { Card } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";

interface WrapperProps {
  children: ReactNode;
  className?: string;
  zeroPadding?: boolean;
}

const Wrapper = ({
  children,
  className = "",
  zeroPadding = false
}: WrapperProps) => (
  <Card
    className={cn("mt-3 cursor-auto", className, { "p-5": !zeroPadding })}
    forceRounded
    onClick={stopEventPropagation}
  >
    {children}
  </Card>
);

export default Wrapper;
