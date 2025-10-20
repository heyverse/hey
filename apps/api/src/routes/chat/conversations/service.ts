import type { Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";

const conversationInclude = {
  messages: {
    include: {
      sender: true
    },
    orderBy: {
      createdAt: "asc" as const
    }
  },
  receiver: true,
  sender: true
} satisfies Prisma.ChatConversationInclude;

const messageInclude = {
  conversation: {
    include: {
      receiver: true,
      sender: true
    }
  },
  sender: true
} satisfies Prisma.MessageInclude;

export const chatService = {
  async ensureAccounts(accountIds: string[]) {
    const uniqueIds = Array.from(new Set(accountIds));
    await Promise.all(
      uniqueIds.map((id) =>
        prisma.lensAccount.upsert({
          create: { id },
          update: {},
          where: { id }
        })
      )
    );
    return uniqueIds;
  },

  async getConversation(conversationId: string) {
    return prisma.chatConversation.findUnique({
      include: conversationInclude,
      where: { id: conversationId }
    });
  },

  async getOrCreateConversation(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new Error("Sender and receiver must be different accounts");
    }

    await this.ensureAccounts([senderId, receiverId]);

    const sortedKey = [senderId, receiverId].sort().join(":");

    const existing = await prisma.chatConversation.findUnique({
      include: conversationInclude,
      where: { key: sortedKey }
    });

    if (existing) {
      return existing;
    }

    return prisma.chatConversation.create({
      data: {
        key: sortedKey,
        receiver: {
          connect: { id: receiverId }
        },
        sender: {
          connect: { id: senderId }
        }
      },
      include: conversationInclude
    });
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    await this.ensureAccounts([senderId]);
    const conversation = await prisma.chatConversation.findUnique({
      select: {
        id: true,
        receiverId: true,
        senderId: true
      },
      where: { id: conversationId }
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (
      conversation.senderId !== senderId &&
      conversation.receiverId !== senderId
    ) {
      throw new Error("Sender is not part of the conversation");
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId
      },
      include: messageInclude
    });

    await prisma.chatConversation.update({
      data: {
        updatedAt: new Date()
      },
      where: { id: conversationId }
    });

    return message;
  }
};
