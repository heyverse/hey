import {
  type AbiItem,
  type ByteArray,
  type Hex,
  type Prettify,
  serializeSignature
} from "viem";
import { sign } from "viem/accounts";
import {
  bytesToString,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionResult,
  encodePacked,
  keccak256,
  parseAbi,
  toBytes
} from "viem/utils";

type ResolverQueryAddr = {
  args:
    | readonly [nodeHash: `0x${string}`]
    | readonly [nodeHash: `0x${string}`, coinType: bigint];
  functionName: "addr";
};

type ResolverQueryText = {
  args: readonly [nodeHash: `0x${string}`, key: string];
  functionName: "text";
};

type ResolverQueryContentHash = {
  args: readonly [nodeHash: `0x${string}`];
  functionName: "contenthash";
};

export type ResolverQuery = Prettify<
  ResolverQueryAddr | ResolverQueryText | ResolverQueryContentHash
>;

type DecodedRequestFullReturnType = {
  name: string;
  query: ResolverQuery;
};

function bytesToPacket(bytes: ByteArray): string {
  let offset = 0;
  let result = "";

  while (offset < bytes.length) {
    const len = bytes[offset];
    if (len === 0) {
      offset += 1;
      break;
    }

    result += `${bytesToString(bytes.subarray(offset + 1, offset + len + 1))}.`;
    offset += len + 1;
  }

  return result.replace(/\.$/, "");
}

function dnsDecodeName(encodedName: string): string {
  const bytesName = toBytes(encodedName);
  return bytesToPacket(bytesName);
}

const OFFCHAIN_RESOLVER_ABI = parseAbi([
  "function resolve(bytes calldata name, bytes calldata data) view returns(bytes memory result, uint64 expires, bytes memory sig)"
]);

const RESOLVER_ABI = parseAbi([
  "function addr(bytes32 node) view returns (address)",
  "function addr(bytes32 node, uint256 coinType) view returns (bytes memory)",
  "function text(bytes32 node, string key) view returns (string memory)",
  "function contenthash(bytes32 node) view returns (bytes memory)"
]);

export function decodeEnsOffchainRequest({
  data
}: {
  sender: `0x${string}`;
  data: `0x${string}`;
}): DecodedRequestFullReturnType {
  const decodedResolveCall = decodeFunctionData({
    abi: OFFCHAIN_RESOLVER_ABI,
    data
  });

  const [dnsEncodedName, encodedResolveCall] = decodedResolveCall.args;
  const name = dnsDecodeName(dnsEncodedName);
  const query = decodeFunctionData({
    abi: RESOLVER_ABI,
    data: encodedResolveCall
  });

  return {
    name,
    query
  };
}

export async function encodeEnsOffchainResponse(
  request: { sender: `0x${string}`; data: `0x${string}` },
  result: string,
  signerPrivateKey: Hex
): Promise<Hex> {
  const { sender, data } = request;
  const { query } = decodeEnsOffchainRequest({ data, sender });
  const ttl = 1000;
  const validUntil = Math.floor(Date.now() / 1000 + ttl);

  const abiItem: AbiItem | undefined = RESOLVER_ABI.find(
    (abi) =>
      abi.name === query.functionName && abi.inputs.length === query.args.length
  );

  const functionResult = encodeFunctionResult({
    abi: [abiItem],
    functionName: query.functionName,
    result
  });

  const messageHash = keccak256(
    encodePacked(
      ["bytes", "address", "uint64", "bytes32", "bytes32"],
      [
        "0x1900",
        sender,
        BigInt(validUntil),
        keccak256(data),
        keccak256(functionResult)
      ]
    )
  );

  const sig = await sign({
    hash: messageHash,
    privateKey: signerPrivateKey
  });

  const encodedResponse = encodeAbiParameters(
    [
      { name: "result", type: "bytes" },
      { name: "expires", type: "uint64" },
      { name: "sig", type: "bytes" }
    ],
    [functionResult, BigInt(validUntil), serializeSignature(sig)]
  );

  return encodedResponse;
}
