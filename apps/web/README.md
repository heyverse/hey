# Web

This workspace contains the Vite-powered React frontend for Hey.

## Commands

- `pnpm dev` – run the development server.
- `pnpm build` – create a production build.

## GraphQL CDN caching

GET requests to `/graphql` that include a persisted query hash are cached at the
CDN. Responses set `Cache-Control: public, max-age=600` and are retained for
ten minutes.

### Purging cached queries

When a persisted query changes, deploy the updated hash. To immediately
invalidate a cached response, purge the specific `/graphql` URL—containing the
`sha256Hash` and any variables—using the Cloudflare cache API.
