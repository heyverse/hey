import { DiscordNotification } from "@penseapp/discord-notification";

interface SendBuzzParams {
  title: string;
  footer: string;
  topic: string;
}

const createDiscordNotification = (topic: string): DiscordNotification => {
  return new DiscordNotification(
    "Hey Bot",
    `https://discord.com/api/webhooks/${topic}`
  );
};

const sendBuzz = ({ title, footer, topic }: SendBuzzParams): boolean => {
  try {
    const discordNotification = createDiscordNotification(topic);

    discordNotification
      .sucessfulMessage()
      .addUsername("Hey Bot")
      .addAvatarURl("https://github.com/heyverse.png")
      .addTitle(title)
      .addFooter(footer)
      .sendMessage();

    return true;
  } catch {
    return false;
  }
};

export default sendBuzz;
