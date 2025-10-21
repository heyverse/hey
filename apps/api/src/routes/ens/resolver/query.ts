import { zeroAddress } from "viem";
import getLensAccount from "@/utils/getLensAccount";
import type { ResolverQuery } from "./utils";

export async function getRecord(name: string, query: ResolverQuery) {
  const { functionName, args } = query;

  let res: string;
  const account = await getLensAccount(name.replace(".hey.xyz", ""));

  switch (functionName) {
    case "addr": {
      res = account.address ?? zeroAddress;
      break;
    }
    case "text": {
      const key = args[1];
      res = account.texts[key as keyof typeof account.texts] ?? "";
      break;
    }
    default: {
      throw new Error(`Unsupported query function ${functionName}`);
    }
  }

  return res;
}
