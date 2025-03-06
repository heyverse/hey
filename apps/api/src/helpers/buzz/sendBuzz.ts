import { DiscordNotification } from "@penseapp/discord-notification";

const sendBuzz = ({
  title,
  footer,
  topic
}: { title: string; footer: string; topic: string }): boolean => {
  try {
    const discordNotification = new DiscordNotification(
      "Hey Bot",
      `https://discord.com/api/webhooks/${topic}`
    );

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
