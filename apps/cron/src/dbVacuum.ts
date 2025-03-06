import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";

const dbVacuum = async () => {
  try {
    await prisma.$queryRaw`VACUUM FULL`;
    logger.info("dbVacuum - Vacuumed database");
  } catch (error) {
    logger.error("dbVacuum - Error vacuuming database", error);
  }
};

export default dbVacuum;
