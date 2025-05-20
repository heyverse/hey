import { H3, H5 } from "@/components/Shared/UI";
import getTokenImage from "@/helpers/getTokenImage";
import { getSimplePaymentDetails } from "@/helpers/rules";
import { useSuperFollowModalStore } from "@/store/non-persisted/modal/useSuperFollowModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { tokens } from "@hey/data/tokens";
import getAccount from "@hey/helpers/getAccount";
import type { AccountFollowRules, AccountFragment } from "@hey/indexer";
import type { Address } from "viem";
import { erc20Abi, formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import TransferFundButton from "../Account/Fund/FundButton";
import Loader from "../Loader";
import LoginButton from "../LoginButton";
import Slug from "../Slug";
import Follow from "./Follow";

const SuperFollow = () => {
  const { currentAccount } = useAccountStore();
  const { superFollowingAccount, setShowSuperFollowModal } =
    useSuperFollowModalStore();
  const { address } = useAccount();
  const { assetAddress, assetSymbol, amount } = getSimplePaymentDetails(
    superFollowingAccount?.rules as AccountFollowRules
  );
  const enabledTokens = tokens.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens?.includes(assetSymbol || "");

  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: assetAddress as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      refetchInterval: 3000,
      enabled: !assetAddress || Boolean(address)
    }
  });

  if (!assetAddress || !assetSymbol || !amount) {
    return null;
  }

  if (balanceLoading) {
    return <Loader message="Loading Super follow" className="my-10" />;
  }

  const erc20Balance =
    balance !== undefined
      ? Number(formatUnits(balance as bigint, 18)).toFixed(2)
      : 0;

  const hasEnoughBalance = Number(erc20Balance) >= Number(amount || 0);

  return (
    <div className="p-5">
      <div className="space-y-1.5 pb-2">
        <H5>
          Pay to follow{" "}
          <Slug slug={getAccount(superFollowingAccount).usernameWithPrefix} />
        </H5>
        <div className="text-gray-500 dark:text-gray-200">
          Support your favorite people on Hey.
        </div>
      </div>
      <div className="flex items-center space-x-1.5 py-2">
        {isTokenEnabled ? (
          <img
            alt={assetSymbol}
            className="size-7 rounded-full"
            height={28}
            src={getTokenImage(assetSymbol)}
            title={assetSymbol}
            width={28}
          />
        ) : (
          <CurrencyDollarIcon className="size-7" />
        )}
        <span className="space-x-1">
          <H3 as="span">{amount}</H3>
          <span className="text-xs">{assetSymbol}</span>
        </span>
      </div>
      <div className="mt-5">
        {currentAccount?.address ? (
          hasEnoughBalance ? (
            <Follow
              account={superFollowingAccount as AccountFragment}
              buttonClassName="w-full"
              small={false}
              title="Super Follow"
              onFollow={() =>
                setShowSuperFollowModal(false, superFollowingAccount)
              }
            />
          ) : (
            <TransferFundButton
              className="w-full"
              token={{ contractAddress: assetAddress, symbol: assetSymbol }}
            />
          )
        ) : (
          <LoginButton className="w-full" title="Login to Follow" />
        )}
      </div>
    </div>
  );
};

export default SuperFollow;
