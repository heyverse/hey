import type { NewAttachment } from "@hey/types/misc";
import { create } from "zustand";

interface State {
  addAttachments: (attachments: NewAttachment[]) => void;
  attachments: NewAttachment[];
  attachmentsMap: Map<string, NewAttachment>;
  isUploading: boolean;
  removeAttachments: (ids: string[]) => void;
  setAttachments: (attachments: NewAttachment[]) => void;
  setIsUploading: (isUploading: boolean) => void;
  updateAttachments: (attachments: NewAttachment[]) => void;
}

const store = create<State>((set) => ({
  addAttachments: (newAttachments) =>
    set((state) => {
      const attachmentsMap = new Map(state.attachmentsMap);
      for (const attachment of newAttachments) {
        if (attachment.id) {
          attachmentsMap.set(attachment.id, attachment);
        }
      }

      return {
        attachments: Array.from(attachmentsMap.values()),
        attachmentsMap
      };
    }),
  attachments: [],
  attachmentsMap: new Map<string, NewAttachment>(),
  isUploading: false,
  removeAttachments: (ids) =>
    set((state) => {
      const attachmentsMap = new Map(state.attachmentsMap);
      for (const id of ids) {
        attachmentsMap.delete(id);
      }

      return {
        attachments: Array.from(attachmentsMap.values()),
        attachmentsMap
      };
    }),
  setAttachments: (attachments) =>
    set(() => {
      const attachmentsMap = new Map<string, NewAttachment>();
      for (const attachment of attachments) {
        if (attachment.id) {
          attachmentsMap.set(attachment.id, attachment);
        }
      }

      return {
        attachments: Array.from(attachmentsMap.values()),
        attachmentsMap
      };
    }),
  setIsUploading: (isUploading) => set(() => ({ isUploading })),
  updateAttachments: (updated) =>
    set((state) => {
      const attachmentsMap = new Map(state.attachmentsMap);
      for (const attachment of updated) {
        if (attachment.id && attachmentsMap.has(attachment.id)) {
          attachmentsMap.set(attachment.id, attachment);
        }
      }

      return {
        attachments: Array.from(attachmentsMap.values()),
        attachmentsMap
      };
    })
}));

export const usePostAttachmentStore = store;
