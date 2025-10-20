import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import { chatService } from "./service";

const createConversation = async (ctx: Context) => {
  try {
    const { senderId, receiverId } = await ctx.req.json();
    const conversation = await chatService.getOrCreateConversation(
      senderId,
      receiverId
    );

    return ctx.json({ conversation, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default createConversation;
