import { APP_NAME } from "@hey/data/constants";

const sendDiscordMessage = async (message: string, topic: string) => {
  const response = await fetch(`https://discord.com/api/webhooks/${topic}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: `${APP_NAME} Bot`,
      avatar_url: "https://github.com/heyverse.png",
      embeds: [{ title: message, timestamp: new Date().toISOString() }]
    })
  });

  return await response.json();
};

export default sendDiscordMessage;
