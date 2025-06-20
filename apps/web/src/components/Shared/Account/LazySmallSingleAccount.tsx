import SmallSingleAccountShimmer from "@/components/Shared/Shimmer/SmallSingleAccountShimmer";
import { useAccountQuery } from "@hey/indexer";
import SmallSingleAccount from "./SmallSingleAccount";

interface LazySmallSingleAccountProps {
  hideSlug?: boolean;
  address: string;
  linkToAccount?: boolean;
}

const LazySmallSingleAccount = ({
  hideSlug = false,
  address,
  linkToAccount = false
}: LazySmallSingleAccountProps) => {
  const { data, loading } = useAccountQuery({
    variables: { request: { address } }
  });

  if (loading) {
    return <SmallSingleAccountShimmer smallAvatar />;
  }

  if (!data?.account) {
    return null;
  }

  return (
    <SmallSingleAccount
      hideSlug={hideSlug}
      linkToAccount={linkToAccount}
      account={data.account}
      smallAvatar
    />
  );
};

export default LazySmallSingleAccount;
