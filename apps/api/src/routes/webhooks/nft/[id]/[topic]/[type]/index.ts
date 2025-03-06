import sendBuzz from "@hey/helpers/sendBuzz";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";

export const post = async (req: Request, res: Response) => {
  try {
    const { id, topic, type } = req.params;
    const body = req.body;

    if (!body.id) {
      return res.json({ success: false });
    }

    return res.json({
      success: await sendBuzz({
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} NFT minted 🎉`,
        footer: body.id,
        topic: `${id}/${topic}`
      })
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
