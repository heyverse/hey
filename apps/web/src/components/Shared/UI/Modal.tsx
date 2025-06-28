import { XMarkIcon } from "@heroicons/react/24/outline";
import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode, SyntheticEvent } from "react";
import { memo } from "react";
import cn from "@/helpers/cn";

interface ModalProps {
  children: ReactNode | ReactNode[];
  onClose?: () => void;
  show: boolean;
  size?: "lg" | "md" | "sm" | "xs";
  title?: ReactNode;
}

const Modal = ({ children, onClose, show, size = "sm", title }: ModalProps) => {
  const handleClose = (event: SyntheticEvent) => {
    event.stopPropagation(); // This stops the event from propagating further
    onClose?.();
  };

  return (
    <RadixDialog.Root onOpenChange={(open) => !open && onClose?.()} open={show}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80"
          onClick={handleClose}
        />
        <div className="fixed inset-0 z-10 flex min-h-screen items-center justify-center overflow-y-auto p-4 text-center sm:block sm:p-0">
          <RadixDialog.Content asChild>
            <div
              className={cn(
                { "sm:max-w-5xl": size === "lg" },
                { "sm:max-w-3xl": size === "md" },
                { "sm:max-w-lg": size === "sm" },
                { "sm:max-w-sm": size === "xs" },
                "inline-block w-full rounded-xl bg-white text-left shadow-xl dark:bg-gray-800"
              )}
            >
              {title ? (
                <RadixDialog.Title className="divider flex items-center justify-between px-5 py-3.5">
                  <b>{title}</b>
                  {onClose ? (
                    <button
                      className="rounded-full p-1 text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      type="button"
                    >
                      <XMarkIcon className="size-5" />
                    </button>
                  ) : null}
                </RadixDialog.Title>
              ) : null}
              {children}
            </div>
          </RadixDialog.Content>
        </div>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default memo(Modal);
