import type { Context } from "hono";
import { decodeFunctionData, encodeAbiParameters, type Hex } from "viem";
import getLensAccount from "@/utils/getLensAccount";

const resolverAbi = [
  {
    inputs: [
      { name: "name", type: "bytes" },
      { name: "data", type: "bytes" }
    ],
    name: "resolve",
    outputs: [{ type: "bytes" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

const hexlify = (data: string) =>
  data.startsWith("0x") ? (data as Hex) : (`0x${data}` as Hex);

const decodeDnsName = (nameHex: Hex): string => {
  const hex = nameHex.slice(2);
  let i = 0;
  const labels: string[] = [];
  while (i < hex.length) {
    const len = Number.parseInt(hex.slice(i, i + 2), 16);
    if (len === 0) break;
    i += 2;
    const labelHex = hex.slice(i, i + len * 2);
    const label = Buffer.from(labelHex, "hex").toString("utf8");
    labels.push(label);
    i += len * 2;
  }
  return labels.join(".");
};

const CCIP = async (ctx: Context) => {
  const sender = ctx.req.param("sender");
  const dataParam = ctx.req.param("data");
  if (!sender || !dataParam) return ctx.json({ error: "Bad Request" }, 400);

  const callData = hexlify(dataParam);

  let decoded: { functionName: string; args: readonly [Hex, Hex] };
  try {
    decoded = decodeFunctionData({ abi: resolverAbi, data: callData }) as any;
  } catch {
    return ctx.json({ error: "Unsupported calldata" }, 400);
  }

  const [dnsName, inner] = decoded.args;
  const fqdn = decodeDnsName(dnsName).toLowerCase();
  if (!fqdn.endsWith(".hey.xyz"))
    return ctx.json({ error: "Unsupported domain" }, 400);
  const label = fqdn.split(".hey.xyz")[0];
  if (!label || label.includes("."))
    return ctx.json({ error: "Invalid label" }, 400);

  const account = await getLensAccount(label);

  const selector = (inner as string).slice(0, 10).toLowerCase();
  let result: Hex | null = null;

  if (selector === "0x3b3b57de") {
    const ret = encodeAbiParameters([{ type: "address" }], [account.address]);
    result = ret;
  } else if (selector === "0xf1cb7e06") {
    const addressBytes = account.address.toLowerCase();
    const raw = `0x${addressBytes.slice(2)}` as Hex;
    const ret = encodeAbiParameters([{ type: "bytes" }], [raw]);
    result = ret;
  } else if (selector === "0x59d1d43c") {
    const textAbi = [
      {
        inputs: [
          { name: "node", type: "bytes32" },
          { name: "key", type: "string" }
        ],
        name: "text",
        outputs: [{ type: "string" }],
        stateMutability: "view",
        type: "function"
      }
    ] as const;

    try {
      const decodedText = decodeFunctionData({
        abi: textAbi,
        data: inner
      }) as any;
      const key = (decodedText.args?.[1] as string)?.toLowerCase();

      let value = "";
      if (key === "name") {
        value = account.name ?? label;
      } else if (key === "avatar") {
        value = account.avatar ?? "";
      } else if (key === "bio" || key === "description") {
        value = account.bio ?? "";
      } else {
        value = "";
      }

      const ret = encodeAbiParameters([{ type: "string" }], [value]);
      result = ret;
    } catch {
      return ctx.json({ error: "Malformed text calldata" }, 400);
    }
  } else {
    return ctx.json({ error: "Unsupported function" }, 400);
  }

  return ctx.json({ data: result, signature: "0x" });
};

export default CCIP;
