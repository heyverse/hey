import { STATIC_IMAGES_URL } from "@hey/data/constants";

export interface WalletDetails {
  logo: string;
  name: string;
}

const WALLETS = {
  familyAccountsProvider: {
    logo: `${STATIC_IMAGES_URL}/wallets/family.png`,
    name: "Login with Family"
  },
  walletConnect: {
    logo: `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`,
    name: "Wallet Connect"
  },
  injected: {
    logo: `${STATIC_IMAGES_URL}/wallets/wallet.svg`,
    name: "Browser Wallet"
  }
} as const;

export type WalletId = keyof typeof WALLETS;

const getWalletDetails = (id: WalletId): WalletDetails => {
  return WALLETS[id];
};

export default getWalletDetails;
