import type { FC, ReactNode } from "react";

interface MetaDetailsProps {
  children: ReactNode;
  icon: ReactNode;
}

const MetaDetails: FC<MetaDetailsProps> = ({ children, icon }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="truncate text-md">{children}</div>
  </div>
);

export default MetaDetails;
