import Slug from "@/components/Shared/Slug";
import { Image } from "@/components/Shared/UI";
import { BLOCK_EXPLORER_URL } from "@hey/data/constants";
import formatAddress from "@hey/helpers/formatAddress";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { type RecipientPercent, useAccountsBulkQuery } from "@hey/indexer";
import { Link } from "react-router";

interface SplitsProps {
  recipients: RecipientPercent[];
}

const Splits = ({ recipients }: SplitsProps) => {
  const { data: recipientProfilesData, loading } = useAccountsBulkQuery({
    skip: !recipients?.length,
    variables: {
      request: { addresses: recipients?.map((r) => r.address) }
    }
  });

  if (!recipients.length) {
    return null;
  }

  const getAccountByAddress = (address: string) => {
    const accounts = recipientProfilesData?.accountsBulk;
    if (accounts) {
      return accounts.find((a) => a.address === address);
    }
  };

  return (
    <div className="space-y-2 pt-3">
      <div className="mb-2 font-bold">Fee recipients</div>
      {recipients.map((recipient) => {
        const { address, percent } = recipient;
        const account = getAccountByAddress(address);

        return (
          <div
            className="flex items-center justify-between text-sm"
            key={address}
          >
            <div className="flex w-full items-center space-x-2">
              {loading ? (
                <>
                  <div className="shimmer size-5 rounded-full" />
                  <div className="shimmer h-3 w-1/4 rounded-full" />
                </>
              ) : (
                <>
                  <Image
                    alt="Avatar"
                    className="size-5 rounded-full border border-neutral-200 bg-neutral-200 dark:border-neutral-700"
                    src={getAvatar(account)}
                  />
                  {account ? (
                    <Link to={getAccount(account).link}>
                      <Slug slug={getAccount(account).usernameWithPrefix} />
                    </Link>
                  ) : (
                    <Link
                      to={`${BLOCK_EXPLORER_URL}/address/${address}`}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {formatAddress(address, 6)}
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="font-bold">{percent}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default Splits;
