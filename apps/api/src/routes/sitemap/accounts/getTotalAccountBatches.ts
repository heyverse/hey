import {
  SITEMAP_BATCH_SIZE,
  SITEMAP_CACHE_DAYS
} from "../../../utils/constants";
import lensPg from "../../../utils/lensPg";
import { getRedis, hoursToSeconds, setRedis } from "../../../utils/redis";

const getTotalAccountBatches = async (): Promise<number> => {
  const cacheKey = "sitemap:accounts:total";
  const cachedData = await getRedis(cacheKey);

  if (cachedData) {
    return Number(cachedData);
  }

  const usernames = (await lensPg.query(
    `
    SELECT CEIL(COUNT(*) / $1) AS count
    FROM account.username_assigned;
  `,
    [SITEMAP_BATCH_SIZE]
  )) as Array<{ count: number }>;

  const totalBatches = Number(usernames[0]?.count) || 0;
  await setRedis(
    cacheKey,
    totalBatches,
    hoursToSeconds(SITEMAP_CACHE_DAYS * 24)
  );
  return totalBatches;
};

export default getTotalAccountBatches;
