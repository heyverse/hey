import type {
  RecipientPercent,
  SimpleCollectActionFragment
} from "@hey/indexer";

const getCollectActionData = (
  collectAction: SimpleCollectActionFragment
): {
  price?: number;
  assetAddress?: string;
  assetSymbol?: string;
  collectLimit?: number;
  endsAt?: string;
  recipients?: RecipientPercent[];
} | null => {
  switch (collectAction.__typename) {
    case "SimpleCollectAction":
      return {
        price: Number.parseFloat(
          collectAction.payToCollect?.price?.value || "0"
        ),
        assetAddress:
          collectAction.payToCollect?.price?.asset?.contract?.address,
        assetSymbol: collectAction.payToCollect?.price?.asset?.symbol,
        collectLimit: Number(collectAction.collectLimit),
        endsAt: collectAction.endsAt,
        recipients: collectAction.payToCollect?.recipients || []
      };
    default:
      return null;
  }
};

export default getCollectActionData;
