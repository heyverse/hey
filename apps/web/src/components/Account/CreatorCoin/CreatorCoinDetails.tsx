import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { type GetCoinResponse, getCoin } from "@zoralabs/coins-sdk";
import { useMemo, useState } from "react";
import type { Address } from "viem";
import { base } from "viem/chains";
import Loader from "@/components/Shared/Loader";
import { Button, Image, Modal } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import humanize from "@/helpers/humanize";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import Trade from "./Trade";

interface CreatorCoinDetailsProps {
  address: Address;
}

const CreatorCoinDetails = ({ address }: CreatorCoinDetailsProps) => {
  const { data: coin } = useQuery<GetCoinResponse["zora20Token"] | null>({
    enabled: !!address,
    queryFn: async () => {
      const coin = await getCoin({ address, chain: base.id });
      return coin.data?.zora20Token ?? null;
    },
    queryKey: ["coin", address],
    refetchInterval: 5000
  });

  const [showTrade, setShowTrade] = useState(false);
  const marketCap = useMemo(() => Number(coin?.marketCap ?? 0), [coin]);
  const delta24h = useMemo(() => Number(coin?.marketCapDelta24h ?? 0), [coin]);
  const changePct = useMemo(() => {
    const prev = marketCap - delta24h;
    if (!prev || !Number.isFinite(prev) || prev === 0) return 0;
    return (delta24h / prev) * 100;
  }, [marketCap, delta24h]);

  const holders = coin?.uniqueHolders ?? 0;
  const volume24h = Number(coin?.volume24h ?? 0);

  const copyAddress = useCopyToClipboard(coin?.address ?? "", "Address copied");

  if (!coin) {
    return <Loader className="my-10" />;
  }

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 text-gray-700 dark:text-gray-300">
            ${coin.symbol}
          </div>
          <div className="font-extrabold text-3xl leading-none tracking-tight md:text-4xl">
            ${humanize(Math.round(marketCap))}
          </div>
          <div
            className={cn(
              "mt-2 inline-flex items-center gap-1 font-medium text-sm",
              changePct >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            <span>{changePct >= 0 ? "▲" : "▼"}</span>
            <span>{`${changePct >= 0 ? "" : "-"}${Math.abs(changePct).toFixed(2)}%`}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Image
            alt={coin.name}
            className="size-12 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
            height={48}
            src={coin.mediaContent?.previewImage?.medium}
            width={48}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-gray-500 text-sm dark:text-gray-400">
            Holders
          </div>
          <div className="font-semibold text-2xl">{humanize(holders)}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 text-sm dark:text-gray-400">
            24h volume
          </div>
          <div className="font-semibold text-2xl">
            ${humanize(Math.round(volume24h))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() =>
            window.open(
              `https://basescan.org/address/${coin.address}`,
              "_blank"
            )
          }
          outline
          size="sm"
        >
          Basescan
        </Button>
        <Button onClick={copyAddress} outline size="sm">
          <ClipboardDocumentIcon className="mr-1 size-4" /> Copy address
        </Button>
      </div>
      <div className="mt-6">
        <Button className="w-full" onClick={() => setShowTrade(true)} size="lg">
          Trade
        </Button>
      </div>
      <Modal
        onClose={() => setShowTrade(false)}
        show={showTrade}
        title={`Trade $${coin.name}`}
      >
        <Trade coin={coin} onClose={() => setShowTrade(false)} />
      </Modal>
    </div>
  );
};

export default CreatorCoinDetails;
