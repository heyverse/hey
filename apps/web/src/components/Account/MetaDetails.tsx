import type { ReactNode } from "react";

interface MetaDetailsProps {
  children: ReactNode;
  icon: ReactNode;
}

const MetaDetails = ({ children, icon }: MetaDetailsProps) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="truncate">{children}</div>
  </div>
);

export default MetaDetails;
