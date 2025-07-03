import { LENS_API_URL } from "@hey/data/constants";
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange
} from "urql";

export const createUrqlClient = () =>
  createClient({
    exchanges: [dedupExchange, cacheExchange, fetchExchange],
    url: LENS_API_URL
  });

const urqlClient = createUrqlClient();

export default urqlClient;
