import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { BLOCK_EXPLORER_URL, DEFAULT_AVATAR } from "@hey/data/constants";
import formatAddress from "@hey/helpers/formatAddress";
import { Link } from "react-router";
import type { Address } from "viem";
import { useEnsName } from "wagmi";
import Slug from "@/components/Shared/Slug";
import { Image } from "@/components/Shared/UI";

interface WalletAccountProps {
  address: Address;
}

const WalletAccount = ({ address }: WalletAccountProps) => {
  const { data, isLoading } = useEnsName({ address });

  const displayName = isLoading
    ? formatAddress(address)
    : data || formatAddress(address);

  return (
    <div className="flex items-center gap-x-3">
      <Image
        alt={address}
        className="size-10 rounded-full border bg-gray-200"
        height={40}
        src={DEFAULT_AVATAR}
        width={40}
      />
      <Link
        rel="noreferrer noopener"
        target="_blank"
        to={`${BLOCK_EXPLORER_URL}/address/${address}`}
      >
        <div className="flex items-center gap-1.5">
          <div>{displayName}</div>
          <ArrowTopRightOnSquareIcon className="size-4" />
        </div>
        <Slug className="text-sm" slug={formatAddress(address)} />
      </Link>
    </div>
  );
};

export default WalletAccount;
