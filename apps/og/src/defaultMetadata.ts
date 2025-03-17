import {
  APP_NAME,
  APP_URL,
  DEFAULT_OG,
  DESCRIPTION
} from "@hey/data/constants";
import type { Metadata } from "next";

const defaultMetadata: Metadata = {
  alternates: { canonical: APP_URL },
  applicationName: APP_NAME,
  description: DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    images: [DEFAULT_OG],
    siteName: "Hey",
    type: "website"
  },
  title: APP_NAME,
  twitter: { card: "summary_large_image", site: "@heydotxyz" }
};

export default defaultMetadata;
