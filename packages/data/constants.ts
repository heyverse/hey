import { chains } from "@lens-chain/sdk/viem";
import { LENS_ENDPOINT } from "./lens-endpoints";
import getEnvConfig from "./utils/getEnvConfig";

// Lens and Hey Env Config
export const LENS_NETWORK = process.env.LENS_NETWORK || "mainnet";

export const LENS_API_URL = getEnvConfig().lensApiEndpoint;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const HEY_APP = getEnvConfig().appAddress;
export const HEY_TREASURY = "0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF";
export const HEY_API_URL = "https://api.hey.xyz";

export const IS_MAINNET = LENS_API_URL === LENS_ENDPOINT.Mainnet;
export const CHAIN = IS_MAINNET ? chains.mainnet : chains.testnet;
export const ADDRESS_PLACEHOLDER = "0x03Ba3...7EF";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

// Subscription
export const SUBSCRIPTION_AMOUNT = 20;

// Application
export const BRAND_COLOR = "#FB3A5D";

// URLs
export const STATIC_ASSETS_URL = "https://static.hey.xyz";
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const LENS_MEDIA_SNAPSHOT_URL = "https://ik.imagekit.io/lens";
export const DEFAULT_AVATAR = `${STATIC_IMAGES_URL}/default.png`;
export const PLACEHOLDER_IMAGE = `${STATIC_IMAGES_URL}/placeholder.webp`;
export const BLOCK_EXPLORER_URL = IS_MAINNET
  ? "https://lenscan.io"
  : "https://testnet.lenscan.io";

// Storage
export const STORAGE_NODE_URL = "https://api.grove.storage";
export const IPFS_GATEWAY = "https://gw.ipfs-lens.dev/ipfs";
export const EVER_API = "https://endpoint.4everland.co";
export const EVER_REGION = "4EVERLAND";
export const EVER_BUCKET = "heyverse";

// Tokens / Keys
export const WALLETCONNECT_PROJECT_ID = "cd542acc70c2b548030f9901a52e70c8";
export const GIPHY_KEY = "yNwCXMKkiBrxyyFduF56xCbSuJJM8cMd"; // Read only safe key

export const LENS_NAMESPACE = "lens/";
export const NATIVE_TOKEN_SYMBOL = IS_MAINNET ? "GHO" : "GRASS";
export const WRAPPED_NATIVE_TOKEN_SYMBOL = IS_MAINNET ? "WGHO" : "WGRASS";

export const MAX_IMAGE_UPLOAD = 8;

// Named transforms for ImageKit
export const TRANSFORMS = {
  ATTACHMENT: "tr:w-1000",
  AVATAR_BIG: "tr:w-350,h-350",
  AVATAR_SMALL: "tr:w-100,h-100",
  AVATAR_TINY: "tr:w-50,h-50",
  COVER: "tr:w-1350,h-350",
  EXPANDED_AVATAR: "tr:w-1000,h-1000"
} as const;

export const BANNER_IDS = {
  PRO: "66923664577042581083893709094038449217361505456682931841068198336764038176504"
} as const;

export const PERMISSIONS = {
  STAFF: "0xA7f2835e54998c6d7d4A0126eC0ebE91b5E43c69",
  SUBSCRIPTION: "0x4BE5b4519814A57E6f9AaFC6afBB37eAEeE35aA3"
} as const;
