import type { AccountFragment } from "@hey/indexer";
import { type GetCoinResponse, getCoin } from "@zoralabs/coins-sdk";
import { useEffect, useState } from "react";
import { base } from "viem/chains";
import getAccountAttribute from "@/helpers/getAccountAttribute";
import { Image, Modal } from "../../Shared/UI";
import MetaDetails from "../MetaDetails";
import CreatorCoinDetails from "./CreatorCoinDetails";

interface CreatorCoinProps {
  account: AccountFragment;
}

const CreatorCoin = ({ account }: CreatorCoinProps) => {
  const [showModal, setShowModal] = useState(false);
  const [coin, setCoin] = useState<GetCoinResponse["zora20Token"] | null>(null);
  const creatorCoinAddress = getAccountAttribute(
    "creatorCoinAddress",
    account?.metadata?.attributes
  );

  useEffect(() => {
    (async () => {
      const coin = await getCoin({
        address: "0x58b14cc0ebb0ce5387557adbe6477e001d3dcde0",
        chain: base.id
      });
      setCoin(coin.data?.zora20Token ?? null);
    })();
  }, [creatorCoinAddress]);

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
        <CreatorCoinDetails coin={coin} />
      </Modal>
    </>
  );
};

export default CreatorCoin;
