import logger from "@hey/helpers/logger";

const heartbeat = async () => {
  try {
    await fetch(
      "https://status.hey.xyz/api/push/NM16jFPpBf?status=up&msg=OK&ping=",
      { method: "HEAD" }
    );

    logger.info("heartbeat - Heartbeat sent to Status API");
  } catch (error) {
    logger.error("heartbeat - Error sending heartbeat", error);
  }
};

export default heartbeat;
