import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import sendDiscordMessage from "src/helpers/sendDiscordMessage";

export const post = async (req: Request, res: Response) => {
  try {
    const { id, topic } = req.params;
    return res.json({
      success: await sendDiscordMessage(
        "New user signed up to Hey 🎉",
        `${id}/${topic}`
      )
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
