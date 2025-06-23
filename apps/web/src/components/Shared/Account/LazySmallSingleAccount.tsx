import { useAccountQuery } from "@hey/indexer";
import SmallSingleAccountShimmer from "@/components/Shared/Shimmer/SmallSingleAccountShimmer";
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
      account={data.account}
      hideSlug={hideSlug}
      linkToAccount={linkToAccount}
      smallAvatar
    />
  );
};

export default LazySmallSingleAccount;
