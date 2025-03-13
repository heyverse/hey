import { openHalliday } from "@halliday-sdk/commerce";
import errorToast from "@helpers/errorToast";
import { DEFAULT_COLLECT_TOKEN } from "@hey/data/constants";
import { Button, Card, Input, Spinner } from "@hey/ui";
import {
  type ChangeEvent,
  type FC,
  type RefObject,
  useRef,
  useState
} from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import { type Address, formatUnits, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWriteContract
} from "wagmi";

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

interface FundProps {
  recipient: Address;
  isHeyTip?: boolean;
  useNativeToken?: boolean;
  onSuccess?: () => void;
}

const Fund: FC<FundProps> = ({
  recipient,
  isHeyTip,
  useNativeToken,
  onSuccess
}) => {
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const { address } = useAccount();
  const symbol = useNativeToken ? "GHO" : "wGHO";

  const { data, isLoading } = useBalance({
    address,
    token: useNativeToken ? undefined : DEFAULT_COLLECT_TOKEN,
    query: { refetchInterval: 2000 }
  });

  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();

  const walletBalance = data
    ? Number.parseFloat(formatUnits(data.value, 18)).toFixed(2)
    : 0;

  const onOtherAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(Number(value));
  };

  const handleSetAmount = (amount: number) => {
    setAmount(Number(amount));
    setOther(false);
  };

  const handleFund = async () => {
    try {
      if (useNativeToken) {
        await sendTransactionAsync({
          to: recipient,
          value: parseEther(amount.toString())
        });
      } else {
        await writeContractAsync({
          abi: ABI,
          functionName: "transfer",
          address: DEFAULT_COLLECT_TOKEN,
          args: [recipient, parseEther(amount.toString())]
        });
      }

      setAmount(2);
      setOther(false);
      onSuccess?.();

      return toast.success(
        isHeyTip ? "Thank you for your support!" : "Funded account successfully"
      );
    } catch (error) {
      return errorToast(error);
    }
  };

  return (
    <Card className="mt-5">
      <div className="mx-5 my-3 flex items-center justify-between">
        <b>{isHeyTip ? "Tip" : "Purchase"}</b>
        {isLoading ? (
          <span className="shimmer h-2.5 w-20 rounded-full" />
        ) : (
          <span className="ld-text-gray-500 text-sm">
            Balance: {walletBalance} {symbol}
          </span>
        )}
      </div>
      <div className="divider" />
      <div className="space-y-5 p-5">
        <div className="flex space-x-4 text-sm">
          <Button
            className="w-full"
            onClick={() => handleSetAmount(2)}
            outline={amount !== 2}
          >
            2 {symbol}
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSetAmount(5)}
            outline={amount !== 5}
          >
            5 {symbol}
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSetAmount(10)}
            outline={amount !== 10}
          >
            10 {symbol}
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              handleSetAmount(other ? 2 : 20);
              setOther(!other);
            }}
            outline={!other}
          >
            Other
          </Button>
        </div>
        {other ? (
          <div>
            <Input
              className="no-spinner"
              max={1000}
              onChange={onOtherAmount}
              prefix={symbol}
              placeholder="300"
              ref={inputRef}
              type="number"
              value={amount}
            />
          </div>
        ) : null}
        <div className="flex space-x-2">
          {isLoading || isWriting || isSending ? (
            <Button
              className="flex w-full justify-center"
              disabled
              icon={<Spinner className="my-1" size="xs" />}
            />
          ) : Number(walletBalance) < amount ? (
            <Button disabled className="w-full">
              Insufficient balance
            </Button>
          ) : (
            <Button
              disabled={amount === 0}
              className="w-full"
              onClick={handleFund}
            >
              {isHeyTip ? "Tip" : "Purchase"} {amount} {symbol}
            </Button>
          )}
          <Button
            disabled={amount === 0}
            className="w-full"
            onClick={() => {
              openHalliday({
                apiKey: "0e3b7179-0be7-44f6-bac6-65323a8d2756",
                destinationChainId: 1,
                destinationAddress: recipient,
                onrampInputAmount: amount.toString(),
                authType: "SESSION_KEY",
                destinationTokenAddress:
                  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                onrampProviders: ["STRIPE"],
                services: ["ONRAMP", "EXCHANGE", "SWAP"]
              });
            }}
            outline
          >
            Use Card
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Fund;
