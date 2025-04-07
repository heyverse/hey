import { Image } from "@/components/Shared/UI";
import { useFundModalStore } from "@/store/non-persisted/modal/useFundModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {
  DEFAULT_COLLECT_TOKEN,
  IS_MAINNET,
  NATIVE_TOKEN_SYMBOL,
  STATIC_IMAGES_URL,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import { useAccountBalancesQuery } from "@hey/indexer";
import Loader from "../../Loader";
import Fund from "./Fund";

const FundAccount = () => {
  const { currentAccount } = useAccountStore();
  const { token } = useFundModalStore();
  const { data: balance, loading } = useAccountBalancesQuery({
    variables: { request: { tokens: [DEFAULT_COLLECT_TOKEN] } },
    pollInterval: 3000,
    skip: !currentAccount?.address,
    fetchPolicy: "no-cache"
  });

  if (loading) {
    return <Loader message="Loading balance..." className="my-10" />;
  }

  const erc20Balance =
    balance?.accountBalances[0].__typename === "Erc20Amount"
      ? balance.accountBalances[0].value
      : 0;

  return (
    <div className="m-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          className="size-12 rounded-full"
          src={`${STATIC_IMAGES_URL}/tokens/${
            IS_MAINNET ? "gho.svg" : "grass.svg"
          }`}
          alt={WRAPPED_NATIVE_TOKEN_SYMBOL}
        />
        <div className="font-bold text-2xl">
          {erc20Balance} {WRAPPED_NATIVE_TOKEN_SYMBOL}
        </div>
        <div className="text-gray-500 text-sm dark:text-gray-200">
          Wrapped {NATIVE_TOKEN_SYMBOL} enables various Hey-specific actions.
        </div>
      </div>
      <Fund token={token} />
    </div>
  );
};

export default FundAccount;
