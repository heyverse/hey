import { APP_NAME } from "@hey/data/constants";

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
