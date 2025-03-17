import { hydrateVerifiedMembers } from "src/store/persisted/useVerifiedMembersStore";

const isVerified = (id: string): boolean => {
  const { verifiedMembers } = hydrateVerifiedMembers();

  return verifiedMembers.includes(id);
};

export default isVerified;
