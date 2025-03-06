import { hydrateVerifiedMembers } from "src/store/persisted/useVerifiedMembersStore";

/**
 * Retrieves whether a account is verified or not.
 *
 * @param {string} id - The account id to check.
 * @returns {boolean} - True if the account is verified, false otherwise.
 */
const isVerified = (id: string): boolean => {
  const { verifiedMembers } = hydrateVerifiedMembers();

  return verifiedMembers.includes(id);
};

export default isVerified;
