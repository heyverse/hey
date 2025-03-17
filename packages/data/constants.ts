import packageJson from "../../package.json";
import LensEndpoint from "./lens-endpoints";
import getEnvConfig from "./utils/getEnvConfig";

// Environments
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

// Lens and Hey Env Config
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK || "mainnet";

export const LENS_API_URL = getEnvConfig().lensApiEndpoint;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const HEY_APP = getEnvConfig().appAddress;
export const HEY_SPONSOR = getEnvConfig().sponsorAddress;
export const HEY_TREASURY = "0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF";
export const HEY_API_PRODUCTION_URL = "https://hey-api.up.railway.app";
export const HEY_API_URL = IS_PRODUCTION
  ? HEY_API_PRODUCTION_URL
  : "http://localhost:4784";

export const IS_MAINNET = LENS_API_URL === LensEndpoint.Mainnet;
export const ADDRESS_PLACEHOLDER = "0x03Ba3...7EF";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

// Application
export const APP_NAME = "Hey";
export const APP_URL = "https://hey.xyz";
export const DESCRIPTION = `${APP_NAME}.xyz is a decentralized, and permissionless social media app built with Lens Protocol 🌿`;
export const APP_VERSION = packageJson.version;
export const BRAND_COLOR = "#FB3A5D";

// URLs
export const UNLEASH_API_URL = "https://unleash-v3.up.railway.app/api/frontend";
export const STATIC_ASSETS_URL = "https://static.hey.xyz";
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const LENS_MEDIA_SNAPSHOT_URL =
  "https://ik.imagekit.io/lens/media-snapshot";
export const DEFAULT_OG = `${STATIC_IMAGES_URL}/og/cover.png`;
export const DEFAULT_AVATAR = `${STATIC_IMAGES_URL}/default.png`;
export const PLACEHOLDER_IMAGE = `${STATIC_IMAGES_URL}/placeholder.webp`;
export const BLOCK_EXPLORER_URL = IS_MAINNET
  ? "https://block-explorer.lens.dev"
  : "https://block-explorer.testnet.lens.dev";

// Storage
export const STORAGE_NODE_URL = "https://api.grove.storage";
export const IPFS_GATEWAY = "https://gw.ipfs-lens.dev/ipfs";
export const EVER_API = "https://endpoint.4everland.co";
export const EVER_REGION = "4EVERLAND";
export const EVER_BUCKET = "heyverse";

// Tokens / Keys
export const WALLETCONNECT_PROJECT_ID = "cd542acc70c2b548030f9901a52e70c8";
export const GIPHY_KEY = "yNwCXMKkiBrxyyFduF56xCbSuJJM8cMd";
export const LIVEPEER_KEY = "70508bf8-2e16-4594-852d-5aed798f6403";
export const UNLEASH_API_TOKEN =
  "*:production.4e706f5ffec12e4444c3acb0c9223ec253580360d346e7b4cf363b79";

// Named transforms for ImageKit
export const AVATAR = "tr:w-350,h-350";
export const EXPANDED_AVATAR = "tr:w-1000,h-1000";
export const COVER = "tr:w-1350,h-350";
export const VIDEO_THUMBNAIL = "tr:h-1000";
export const ATTACHMENT = "tr:w-1000";

// Known Lens Protocol Attributes
export const KNOWN_ATTRIBUTES = {
  HIDE_OEMBED: "hideOembed"
};

export const LENS_NAMESPACE = "lens/";
