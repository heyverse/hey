import TopUpButton from "@/components/Shared/Account/TopUp/Button";
import Loader from "@/components/Shared/Loader";
import LoginButton from "@/components/Shared/LoginButton";
import Slug from "@/components/Shared/Slug";
import { H3, H5 } from "@/components/Shared/UI";
import getTokenImage from "@/helpers/getTokenImage";
import { getSimplePaymentDetails } from "@/helpers/rules";
import { useSuperFollowModalStore } from "@/store/non-persisted/modal/useSuperFollowModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { tokens } from "@hey/data/tokens";
import getAccount from "@hey/helpers/getAccount";
import {
  type AccountFollowRules,
  type AccountFragment,
  useBalancesBulkQuery
} from "@hey/indexer";
import Follow from "./Follow";

const SuperFollow = () => {
  const { currentAccount } = useAccountStore();
  const { superFollowingAccount, setShowSuperFollowModal } =
    useSuperFollowModalStore();
  const { assetAddress, assetSymbol, amount } = getSimplePaymentDetails(
    superFollowingAccount?.rules as AccountFollowRules
  );
  const enabledTokens = tokens.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens?.includes(assetSymbol || "");

  const { data: balance, loading: balanceLoading } = useBalancesBulkQuery({
    variables: {
      request: { address: currentAccount?.address, tokens: [assetAddress] }
    },
    pollInterval: 3000,
    skip: !assetAddress || !currentAccount?.address,
    fetchPolicy: "no-cache"
  });

  if (!assetAddress || !assetSymbol || !amount) {
    return null;
  }

  if (balanceLoading) {
    return <Loader message="Loading Super follow" className="my-10" />;
  }

  const tokenBalance =
    balance?.balancesBulk[0].__typename === "Erc20Amount"
      ? balance.balancesBulk[0].value
      : 0;

  const hasEnoughBalance = Number(tokenBalance) >= Number(amount || 0);

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
            <TopUpButton
              className="w-full"
              token={{ contractAddress: assetAddress, symbol: assetSymbol }}
              amountToTopUp={
                Math.ceil((amount - Number(tokenBalance)) * 20) / 20
              }
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
