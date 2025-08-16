import type { MouseEvent } from "react";

const stopEventPropagation = (event: MouseEvent<Element>) => {
  event.stopPropagation();
};

export default stopEventPropagation;
