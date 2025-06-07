import type { SyntheticEvent } from "react";

const stopEventPropagation = (event: SyntheticEvent) => event.stopPropagation();

export default stopEventPropagation;
