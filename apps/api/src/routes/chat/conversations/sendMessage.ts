import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import { chatService } from "./service";

const sendMessage = async (ctx: Context) => {
  try {
    const { conversationId } = ctx.req.param();
    const { senderId, content } = await ctx.req.json();
    const message = await chatService.sendMessage(
      conversationId,
      senderId,
      content
    );

    return ctx.json({ message, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default sendMessage;
