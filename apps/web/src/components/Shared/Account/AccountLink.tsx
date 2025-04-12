import { useAccountLinkStore } from "@/store/non-persisted/navigation/useAccountLinkStore";
import getAccount from "@hey/helpers/getAccount";
import type { AccountFragment } from "@hey/indexer";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";

interface AccountLinkProps extends Omit<ComponentProps<typeof Link>, "to"> {
  account: AccountFragment;
  children: ReactNode;
}

const AccountLink = ({
  account,
  children,
  onClick,
  ...props
}: AccountLinkProps) => {
  const { setCachedAccount } = useAccountLinkStore();
  const { link } = getAccount(account);

  return (
    <Link
      to={link}
      {...props}
      onClick={(e) => {
        setCachedAccount(account);
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};

export default AccountLink;
