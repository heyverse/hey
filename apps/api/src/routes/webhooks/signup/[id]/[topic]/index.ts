import sendBuzz from "@hey/helpers/sendBuzz";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";

export const post = async (req: Request, res: Response) => {
  try {
    const { id, topic } = req.params;
    const body = req.body;

    if (!body.id) {
      return res.json({ success: false });
    }

    return res.json({
      success: await sendBuzz({
        title: "New user signed up to Hey 🎉",
        footer: body.id,
        topic: `${id}/${topic}`
      })
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
