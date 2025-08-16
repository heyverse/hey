import { memo } from "react";
import { H2 } from "@/components/Shared/UI";

interface PageHeaderProps {
  title: string;
  updatedAt?: string;
}

const PageHeader = ({ title, updatedAt }: PageHeaderProps) => (
  <div className="flex h-48 w-full items-center justify-center rounded-none bg-gray-400 md:rounded-xl">
    <div className="relative text-center">
      <H2 className="text-white">{title}</H2>
      {updatedAt ? (
        <div className="mt-4 flex justify-center">
          <div className="rounded-md bg-gray-800 px-2 py-0.5 text-white text-xs">
            Updated {updatedAt}
          </div>
        </div>
      ) : null}
    </div>
  </div>
);

export default memo(PageHeader);
