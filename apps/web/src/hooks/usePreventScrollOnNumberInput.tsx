import type { RefObject } from "react";
import { useEffect } from "react";

const usePreventScrollOnNumberInput = (
  ref: RefObject<HTMLInputElement>
): void => {
  useEffect(() => {
    const input = ref.current;

    const preventScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    if (input) {
      input.addEventListener("wheel", preventScroll, { passive: false });
    }

    return () => {
      if (input) {
        input.removeEventListener("wheel", preventScroll);
      }
    };
  }, [ref]);
};

export default usePreventScrollOnNumberInput;
