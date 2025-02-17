import { http, type Hex, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const heyWalletClient = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY as Hex),
  transport: http("https://rpc.yoginth.com")
});
