import type {
  RecipientPercent,
  SimpleCollectActionFragment
} from "@hey/indexer";

/**
 * Retrieves the collect action data from a collect action fragment.
 *
 * @param collectAction The collect action fragment.
 * @returns An object containing the collect action data, or null if the collect action is not a simple collect action.
 */
const getCollectActionData = (
  collectAction: SimpleCollectActionFragment
): {
  amount?: number;
  assetAddress?: string;
  assetDecimals?: number;
  assetSymbol?: string;
  collectLimit?: number;
  endsAt?: string;
  recipients?: RecipientPercent[];
} | null => {
  switch (collectAction.__typename) {
    case "SimpleCollectAction":
      return {
        amount: Number.parseFloat(collectAction.amount?.value || "0"),
        assetAddress: collectAction.amount?.asset?.contract?.address,
        assetDecimals: collectAction.amount?.asset?.decimals,
        assetSymbol: collectAction.amount?.asset?.symbol,
        collectLimit: Number(collectAction.collectLimit),
        endsAt: collectAction.endsAt,
        recipients: collectAction.recipients || []
      };
    default:
      return null;
  }
};

export default getCollectActionData;
