import type { AccountFragment } from "@hey/indexer";
import { motion } from "motion/react";
import { Virtualizer } from "virtua";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";

interface MoreRelevantPeopleProps {
  accounts: AccountFragment[];
}

const MoreRelevantPeople = ({ accounts }: MoreRelevantPeopleProps) => {
  const { currentAccount } = useAccountStore();

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {accounts.slice(5).map((account, index) => (
          <motion.div
            key={account.address}
            className={cn(
              "divider p-5",
              index === accounts.slice(5).length - 1 && "border-b-0"
            )}
            initial="hidden"
            animate="visible"
            variants={accountsList}
          >
            <SingleAccount
              hideFollowButton={currentAccount?.address === account.address}
              hideUnfollowButton={currentAccount?.address === account.address}
              account={account}
              showBio
              showUserPreview={false}
            />
          </motion.div>
        ))}
      </Virtualizer>
    </div>
  );
};

export default MoreRelevantPeople;
