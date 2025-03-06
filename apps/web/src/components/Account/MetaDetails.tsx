import type { ReactNode } from "react";

const MetaDetails = ({
  children,
  icon
}: {
  children: ReactNode;
  icon: ReactNode;
}) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="truncate text-md">{children}</div>
  </div>
);

export default MetaDetails;
