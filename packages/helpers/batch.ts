import { unstable_batchedUpdates } from "react-dom";

/**
 * Batch multiple state updates into a single render.
 */
const batch = (fn: () => void): void => {
  unstable_batchedUpdates(fn);
};

export default batch;
