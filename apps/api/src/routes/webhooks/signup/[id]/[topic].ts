import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import sendDiscordMessage from "src/helpers/sendDiscordMessage";

export const post = async (req: Request, res: Response) => {
  try {
    const { id, topic } = req.params;
    await sendDiscordMessage("New user signed up to Hey 🎉", `${id}/${topic}`);
    return res.json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
