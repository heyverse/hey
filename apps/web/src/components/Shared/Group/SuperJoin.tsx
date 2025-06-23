import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { tokens } from "@hey/data/tokens";
import {
  type GroupFragment,
  type GroupRules,
  useBalancesBulkQuery
} from "@hey/indexer";
import TopUpButton from "@/components/Shared/Account/TopUp/Button";
import Loader from "@/components/Shared/Loader";
import LoginButton from "@/components/Shared/LoginButton";
import { H3, H5 } from "@/components/Shared/UI";
import getTokenImage from "@/helpers/getTokenImage";
import { getSimplePaymentDetails } from "@/helpers/rules";
import { useSuperJoinModalStore } from "@/store/non-persisted/modal/useSuperJoinModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Join from "./Join";

const SuperJoin = () => {
  const { currentAccount } = useAccountStore();
  const { superJoiningGroup, setShowSuperJoinModal } = useSuperJoinModalStore();
  const { assetAddress, assetSymbol, amount } = getSimplePaymentDetails(
    superJoiningGroup?.rules as GroupRules
  );
  const enabledTokens = tokens.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens?.includes(assetSymbol || "");

  const { data: balance, loading: balanceLoading } = useBalancesBulkQuery({
    fetchPolicy: "no-cache",
    pollInterval: 3000,
    skip: !assetAddress || !currentAccount?.address,
    variables: {
      request: { address: currentAccount?.address, tokens: [assetAddress] }
    }
  });

  if (!assetAddress || !assetSymbol || !amount) {
    return null;
  }

  if (balanceLoading) {
    return <Loader className="my-10" message="Loading Super join" />;
  }

  const tokenBalance =
    balance?.balancesBulk[0].__typename === "Erc20Amount"
      ? balance.balancesBulk[0].value
      : 0;

  const hasEnoughBalance = Number(tokenBalance) >= Number(amount || 0);

  return (
    <div className="p-5">
      <div className="space-y-1.5 pb-2">
        <H5>Super Join</H5>
        <div className="text-gray-500 dark:text-gray-200">
          Support your favorite group on Hey.
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
            <Join
              className="w-full"
              group={superJoiningGroup as GroupFragment}
              onSuccess={() => setShowSuperJoinModal(false, superJoiningGroup)}
              small={false}
              title={
                superJoiningGroup?.membershipApprovalEnabled
                  ? "Request to join"
                  : "Super Join"
              }
            />
          ) : (
            <TopUpButton
              amountToTopUp={
                Math.ceil((amount - Number(tokenBalance)) * 20) / 20
              }
              className="w-full"
              token={{ contractAddress: assetAddress, symbol: assetSymbol }}
            />
          )
        ) : (
          <LoginButton className="w-full" title="Login to Join" />
        )}
      </div>
    </div>
  );
};

export default SuperJoin;
