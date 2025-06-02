import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { html } from "hono/html";

const defaultMetadata = html`
  <html>
    <head>
      <link rel="canonical" href="https://hey.xyz" />
      <meta name="application-name" content="Hey" />
      <meta name="description" content="A decentralized, and permissionless social media app built with Lens" />
      <meta property="og:title" content="Hey" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Hey" />
      <meta property="og:image" content="${`${STATIC_IMAGES_URL}/og/cover.png`}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@heydotxyz" />
      <title>Hey</title>
    </head>
    <body>
      <h1>Hey</h1>
      <p>A decentralized, and permissionless social media app built with Lens</p>
    </body>
  </html>
`;

export default defaultMetadata;
