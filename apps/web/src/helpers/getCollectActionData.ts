import type {
  RecipientPercent,
  SimpleCollectActionFragment
} from "@hey/indexer";

interface CollectActionData {
  price?: number;
  assetAddress?: string;
  assetSymbol?: string;
  collectLimit?: number;
  endsAt?: string;
  recipients?: RecipientPercent[];
}

const getCollectActionData = (
  collectAction: SimpleCollectActionFragment
): CollectActionData | null => {
  if (collectAction.__typename !== "SimpleCollectAction") {
    return null;
  }

  const { payToCollect, collectLimit, endsAt } = collectAction;

  return {
    assetAddress: payToCollect?.price?.asset?.contract?.address,
    assetSymbol: payToCollect?.price?.asset?.symbol,
    collectLimit: Number(collectLimit),
    endsAt,
    price: Number.parseFloat(payToCollect?.price?.value ?? "0"),
    recipients: payToCollect?.recipients ?? []
  };
};

export default getCollectActionData;
