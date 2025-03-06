import { APP_NAME } from "@hey/data/constants";

/**
 * Sends a message to a Discord webhook.
 *
 * @param {object} options - An object with the following properties:
 *   - {string} title - The title of the message.
 *   - {object} [footer] - An object with the following properties:
 *     - {string} text - The text of the footer.
 *     - {string} [icon_url] - The URL of the icon to use for the footer.
 *   - {string} topic - The topic of the message (the ID of the webhook).
 *
 * @returns {Promise<boolean>} Whether the message was sent successfully.
 */
const sendBuzz = async ({
  title,
  footer,
  topic
}: {
  title: string;
  footer?: { text: string; icon_url?: string };
  topic: string;
}): Promise<boolean> => {
  try {
    const response = await fetch(`https://discord.com/api/webhooks/${topic}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: `${APP_NAME} Bot`,
        avatar_url: "https://github.com/heyverse.png",
        embeds: [
          {
            title,
            footer,
            timestamp: new Date().toISOString()
          }
        ]
      })
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export default sendBuzz;
