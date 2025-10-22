import type { GetCoinResponse } from "@zoralabs/coins-sdk";

interface CreatorCoinDetailsProps {
  coin: GetCoinResponse["zora20Token"];
}

const CreatorCoinDetails = ({ coin }: CreatorCoinDetailsProps) => {
  return <div>gm</div>;
};

export default CreatorCoinDetails;
