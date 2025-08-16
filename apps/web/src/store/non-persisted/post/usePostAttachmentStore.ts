import type { NewAttachment } from "@hey/types/misc";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  addAttachments: (attachments: NewAttachment[]) => void;
  attachments: NewAttachment[];
  isUploading: boolean;
  removeAttachments: (ids: string[]) => void;
  setAttachments: (attachments: NewAttachment[]) => void;
  setIsUploading: (isUploading: boolean) => void;
  updateAttachments: (attachments: NewAttachment[]) => void;
}

const { useStore: usePostAttachmentStore } = createTrackedStore<State>(
  (set) => ({
    addAttachments: (newAttachments) =>
      set((state) => {
        return { attachments: [...state.attachments, ...newAttachments] };
      }),
    attachments: [],
    isUploading: false,
    removeAttachments: (ids) =>
      set((state) => {
        const attachments = [...state.attachments];
        for (const id of ids) {
          const index = attachments.findIndex((a) => a.id === id);
          if (index !== -1) {
            attachments.splice(index, 1);
          }
        }
        return { attachments };
      }),
    setAttachments: (attachments) => set(() => ({ attachments })),
    setIsUploading: (isUploading) => set(() => ({ isUploading })),
    updateAttachments: (updateAttachments) =>
      set((state) => {
        const attachments = [...state.attachments];
        for (const attachment of updateAttachments) {
          const index = attachments.findIndex((a) => a.id === attachment.id);
          if (index !== -1) {
            attachments[index] = attachment;
          }
        }
        return { attachments };
      })
  })
);

export { usePostAttachmentStore };
