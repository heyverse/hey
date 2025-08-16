import type { ReactNode } from "react";
import { memo } from "react";
import { H5 } from "./Typography";

interface CardHeaderProps {
  body?: ReactNode;
  icon?: ReactNode;
  hideDivider?: boolean;
  title: ReactNode;
}

const CardHeader = ({
  body,
  icon,
  hideDivider = false,
  title
}: CardHeaderProps) => {
  return (
    <>
      <div className="mx-5 my-3 space-y-2">
        <div className="flex items-center gap-x-3">
          {icon ? icon : null}
          <H5>{title}</H5>
        </div>
        {body ? <p>{body}</p> : null}
      </div>
      {hideDivider ? null : <div className="divider" />}
    </>
  );
};

export default memo(CardHeader);
