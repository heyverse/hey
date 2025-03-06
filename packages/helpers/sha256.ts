import { createHash } from "node:crypto";

/**
 * Retrieves the SHA-256 hash of a given string.
 *
 * @param {string} text - The string to hash.
 * @returns {string} The SHA-256 hash of the given string.
 */
const sha256 = (text: string): string => {
  return createHash("sha256").update(text).digest("hex");
};

export default sha256;
