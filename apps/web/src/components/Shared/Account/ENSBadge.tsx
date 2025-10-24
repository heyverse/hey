import type { AccountFragment } from "@hey/indexer";
import { Link } from "react-router";
import { Image, Tooltip } from "@/components/Shared/UI";

interface ENSBadgeProps {
  account: AccountFragment;
  className?: string;
  linkToDashboard?: boolean;
}

const ENSBadge = ({
  account,
  className,
  linkToDashboard = false
}: ENSBadgeProps) => {
  if (!account.heyEns) {
    return null;
  }

  const Logo = (
    <Image
      className={className}
      src="https://ens.domains/assets/brand/mark/ens-mark-Blue.svg"
    />
  );

  return (
    <Tooltip content={`${account.heyEns.localName}.hey.xyz`} placement="right">
      {linkToDashboard ? (
        <Link
          target="_blank"
          to={`https://app.ens.domains/${account.heyEns.localName}.hey.xyz`}
        >
          {Logo}
        </Link>
      ) : (
        Logo
      )}
    </Tooltip>
  );
};

export default ENSBadge;
