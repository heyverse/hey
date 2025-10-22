import type { AccountFragment } from "@hey/indexer";
import { useQuery } from "@tanstack/react-query";
import { type GetCoinResponse, getCoin } from "@zoralabs/coins-sdk";
import { useState } from "react";
import type { Address } from "viem";
import { base } from "viem/chains";
import { Image, Modal } from "../../Shared/UI";
import MetaDetails from "../MetaDetails";
import CreatorCoinDetails from "./CreatorCoinDetails";

interface CreatorCoinProps {
  account: AccountFragment;
}

const CreatorCoin = ({ account }: CreatorCoinProps) => {
  const [showModal, setShowModal] = useState(false);
  // const creatorCoinAddress = getAccountAttribute(
  //   "creatorCoinAddress",
  //   account?.metadata?.attributes
  // );
  const creatorCoinAddress = "0x9b13358e3a023507e7046c18f508a958cda75f54";

  const { data: coin } = useQuery<GetCoinResponse["zora20Token"] | null>({
    enabled: !!creatorCoinAddress,
    queryFn: async () => {
      const coin = await getCoin({
        address: creatorCoinAddress,
        chain: base.id
      });
      return coin.data?.zora20Token ?? null;
    },
    queryKey: ["coin", creatorCoinAddress]
  });

  if (!coin) {
    return null;
  }

  return (
    <>
      <button
        className="rounded-full bg-gray-200 px-2 py-0.5 dark:bg-gray-700"
        onClick={() => setShowModal(true)}
        type="button"
      >
        <MetaDetails
          icon={
            <Image
              alt={coin.name}
              className="size-4 rounded-full"
              height={16}
              src={coin.mediaContent?.previewImage?.medium}
              width={16}
            />
          }
        >
          ${coin.symbol}
        </MetaDetails>
      </button>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Creator Coin"
      >
        <CreatorCoinDetails address={coin.address as Address} />
      </Modal>
    </>
  );
};

export default CreatorCoin;
