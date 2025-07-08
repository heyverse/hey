import type { RefObject } from "react";
import { useCallback, useEffect } from "react";

const usePreventScrollOnNumberInput = (
  ref: RefObject<HTMLInputElement>
): void => {
  const preventScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const input = ref.current;

    if (input) {
      input.addEventListener("wheel", preventScroll, { passive: false });
    }

    return () => {
      if (input) {
        input.removeEventListener("wheel", preventScroll);
      }
    };
  }, [ref, preventScroll]);
};

export default usePreventScrollOnNumberInput;
