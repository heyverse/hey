import type { GetCoinResponse } from "@zoralabs/coins-sdk";
import {
  createTradeCall,
  type TradeParameters,
  tradeCoin
} from "@zoralabs/coins-sdk";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Address } from "viem";
import {
  createPublicClient,
  erc20Abi,
  formatEther,
  formatUnits,
  http,
  parseEther,
  parseUnits
} from "viem";
import { base } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { Button, Image, Input, Tabs, Tooltip } from "@/components/Shared/UI";
import useHandleWrongNetwork from "@/hooks/useHandleWrongNetwork";

interface TradeModalProps {
  coin: NonNullable<GetCoinResponse["zora20Token"]>;
  onClose: () => void;
}

type Mode = "buy" | "sell";

const Trade = ({ coin, onClose }: TradeModalProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = useMemo(
    () => createPublicClient({ chain: base, transport: http() }),
    []
  );
  const handleWrongNetwork = useHandleWrongNetwork({ chainId: base.id });

  const [mode, setMode] = useState<Mode>("buy");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [ethBalance, setEthBalance] = useState<bigint>(0n);
  const [tokenBalance, setTokenBalance] = useState<bigint>(0n);
  const [estimatedOut, setEstimatedOut] = useState<string>("");

  // balances
  useEffect(() => {
    (async () => {
      if (!address) return;
      try {
        const [eth, token] = await Promise.all([
          publicClient.getBalance({ address }),
          publicClient.readContract({
            abi: erc20Abi,
            address: coin.address as Address,
            args: [address],
            functionName: "balanceOf"
          })
        ]);
        setEthBalance(eth);
        setTokenBalance(token as bigint);
      } catch {
        // ignore
      }
    })();
  }, [address, coin.address, publicClient]);

  const tokenDecimals = 18; // ZORA20 tokens have 18 decimals

  const setPercentAmount = (pct: number) => {
    const decimals = 6;
    if (mode === "buy") {
      const available = Number(formatEther(ethBalance));
      const gasReserve = 0.0002; // leave a tiny bit for gas on Base
      const baseAmt = (available * pct) / 100;
      const amt = pct === 100 ? Math.max(baseAmt - gasReserve, 0) : baseAmt;
      setAmount(amt.toFixed(decimals));
    } else {
      const available = Number(formatUnits(tokenBalance, tokenDecimals));
      const amt = Math.max((available * pct) / 100, 0);
      setAmount(amt.toFixed(decimals));
    }
  };

  const makeParams = (): TradeParameters | null => {
    if (!address) return null;
    const sender = address as Address;
    if (!amount || Number(amount) <= 0) return null;
    if (mode === "buy") {
      return {
        amountIn: parseEther(amount),
        buy: { address: coin.address as Address, type: "erc20" },
        sell: { type: "eth" },
        sender,
        slippage: 0.01
      };
    }

    return {
      amountIn: parseUnits(amount, tokenDecimals),
      buy: { type: "eth" },
      sell: { address: coin.address as Address, type: "erc20" },
      sender,
      slippage: 0.01
    };
  };

  const handleSubmit = async () => {
    console.log(walletClient);
    if (!walletClient || !publicClient || !address) {
      return toast.error("Connect a wallet to trade");
    }

    const params = makeParams();
    if (!params) return;
    try {
      setLoading(true);
      await handleWrongNetwork();
      const receipt = await tradeCoin({
        account: walletClient.account,
        publicClient,
        tradeParameters: params,
        walletClient
      });
      toast.success("Trade submitted");
      onClose();
      console.log("trade receipt", receipt);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const sender = (address as Address) || undefined;
      if (!sender || !amount) {
        setEstimatedOut("");
        return;
      }
      const params: TradeParameters =
        mode === "buy"
          ? {
              amountIn: parseEther(amount),
              buy: { address: coin.address as Address, type: "erc20" },
              sell: { type: "eth" },
              sender,
              slippage: 0.01
            }
          : {
              amountIn: parseUnits(amount, tokenDecimals),
              buy: { type: "eth" },
              sell: { address: coin.address as Address, type: "erc20" },
              sender,
              slippage: 0.01
            };
      try {
        const q = await createTradeCall(params);
        if (!cancelled) {
          const out = q.quote.amountOut || "0";
          setEstimatedOut(out);
        }
      } catch {
        if (!cancelled) setEstimatedOut("");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [address, amount, coin.address, mode]);

  const symbol = coin.symbol || "";

  const balanceLabel =
    mode === "buy"
      ? `Balance: ${Number(formatEther(ethBalance)).toFixed(6)}`
      : `Balance: ${Number(formatUnits(tokenBalance, tokenDecimals)).toFixed(3)}`;

  return (
    <div className="p-5">
      <Tabs
        active={mode}
        className="mb-4"
        layoutId="trade-mode"
        setActive={(t) => setMode(t as Mode)}
        tabs={[
          { name: "Buy", type: "buy" },
          { name: "Sell", type: "sell" }
        ]}
      />

      <div className="relative mb-2">
        <Input
          inputMode="decimal"
          label="Amount"
          onChange={(e) => setAmount(e.target.value)}
          placeholder={mode === "buy" ? "0.01" : "0"}
          prefix={
            mode === "buy" ? (
              "ETH"
            ) : (
              <Tooltip content={`$${symbol}`}>
                <Image
                  alt={coin.name}
                  className="size-5 rounded-full"
                  height={20}
                  src={coin.mediaContent?.previewImage?.small}
                  width={20}
                />
              </Tooltip>
            )
          }
          value={amount}
        />
      </div>
      <div className="mb-3 flex items-center justify-between text-gray-500 text-xs dark:text-gray-400">
        <div>
          Estimated amount:{" "}
          {estimatedOut
            ? mode === "buy"
              ? `${Number(
                  formatUnits(BigInt(estimatedOut), tokenDecimals)
                ).toFixed(6)}`
              : `${Number(formatEther(BigInt(estimatedOut))).toFixed(6)} ETH`
            : "-"}
        </div>
        <div>{balanceLabel}</div>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2">
        {[25, 50, 75].map((p) => (
          <Button key={p} onClick={() => setPercentAmount(p)} outline>
            {p}%
          </Button>
        ))}
        <Button onClick={() => setPercentAmount(100)} outline>
          Max
        </Button>
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!amount || !address}
        loading={loading}
        onClick={handleSubmit}
        size="lg"
      >
        {mode === "buy" ? "Buy" : "Sell"}
      </Button>
    </div>
  );
};

export default Trade;
