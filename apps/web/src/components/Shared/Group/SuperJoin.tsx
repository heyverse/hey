import { H3, H5 } from "@/components/Shared/UI";
import getTokenImage from "@/helpers/getTokenImage";
import {
  getMembershipApprovalDetails,
  getSimplePaymentDetails
} from "@/helpers/rules";
import { useSuperJoinModalStore } from "@/store/non-persisted/modal/useSuperJoinModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { tokens } from "@hey/data/tokens";
import {
  type Group,
  type GroupRules,
  useAccountBalancesQuery
} from "@hey/indexer";
import TopUpButton from "../Account/Fund/TopUp/Button";
import Loader from "../Loader";
import LoginButton from "../LoginButton";
import Join from "./Join";

const SuperJoin = () => {
  const { currentAccount } = useAccountStore();
  const { superJoiningGroup, setShowSuperJoinModal } = useSuperJoinModalStore();
  const { assetAddress, assetSymbol, amount } = getSimplePaymentDetails(
    superJoiningGroup?.rules as GroupRules
  );
  const requiresMembershipApproval = getMembershipApprovalDetails(
    superJoiningGroup?.rules as GroupRules
  );
  const enabledTokens = tokens.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens?.includes(assetSymbol || "");

  const { data: balance, loading: balanceLoading } = useAccountBalancesQuery({
    variables: { request: { tokens: [assetAddress] } },
    pollInterval: 3000,
    skip: !assetAddress || !currentAccount?.address,
    fetchPolicy: "no-cache"
  });

  if (!assetAddress || !assetSymbol || !amount) {
    return null;
  }

  if (balanceLoading) {
    return <Loader message="Loading Super join" className="my-10" />;
  }

  const erc20Balance =
    balance?.accountBalances[0].__typename === "Erc20Amount"
      ? balance.accountBalances[0].value
      : 0;

  const hasEnoughBalance = Number(erc20Balance) >= Number(amount || 0);

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
              group={superJoiningGroup as Group}
              setJoined={() => setShowSuperJoinModal(false, superJoiningGroup)}
              small={false}
              title={
                requiresMembershipApproval ? "Request to join" : "Super Join"
              }
            />
          ) : (
            <TopUpButton
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
