import type { HTMLProps } from "react";

const Code = (props: HTMLProps<HTMLElement>) => {
  return (
    <code
      className="rounded-lg bg-gray-300 px-[5px] py-[2px] text-sm dark:bg-gray-700"
      {...props}
    />
  );
};

export default Code;
