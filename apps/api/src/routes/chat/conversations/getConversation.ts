import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import ApiError from "@/utils/apiError";
import handleApiError from "@/utils/handleApiError";
import { chatService } from "./service";

const getConversation = async (ctx: Context) => {
  try {
    const { conversationId } = ctx.req.param();
    const conversation = await chatService.getConversation(conversationId);

    if (!conversation) {
      throw new ApiError(404, "Conversation not found.");
    }

    return ctx.json({ conversation, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default getConversation;
