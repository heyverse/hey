import { zeroAddress } from "viem";
import getLensAccount from "@/utils/getLensAccount";
import type { ResolverQuery } from "./utils";

export async function getRecord(name: string, query: ResolverQuery) {
  const { functionName, args } = query;

  let res: string;
  const account = await getLensAccount(name);

  const texts = {
    avatar: account.avatar,
    bio: account.bio,
    name: account.name
  };

  switch (functionName) {
    case "addr": {
      res = account.address ?? zeroAddress;
      break;
    }
    case "text": {
      const key = args[1];
      res = texts[key as keyof typeof texts] ?? "";
      break;
    }
    default: {
      throw new Error(`Unsupported query function ${functionName}`);
    }
  }

  return res;
}
