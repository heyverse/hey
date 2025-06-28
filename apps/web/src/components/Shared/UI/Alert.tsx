import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { memo } from "react";
import { Button } from "@/components/Shared/UI";
import { H4 } from "./Typography";

interface AlertProps {
  cancelText?: string;
  children?: ReactNode;
  confirmText?: string;
  description: ReactNode;
  isPerformingAction?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  show: boolean;
  title: ReactNode;
}

const Alert = ({
  cancelText = "Cancel",
  children,
  confirmText,
  description,
  isPerformingAction = false,
  onClose,
  onConfirm,
  show,
  title
}: AlertProps) => {
  return (
    <RadixDialog.Root onOpenChange={(open) => !open && onClose()} open={show}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-10 bg-gray-500/75 dark:bg-gray-900/80" />
        <div className="fixed inset-0 z-10 flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
          <RadixDialog.Content asChild>
            <div className="inline-block w-full space-y-6 rounded-xl bg-white p-5 text-left shadow-xl sm:max-w-sm dark:bg-gray-800">
              <RadixDialog.Title className="space-y-2">
                <H4>{title}</H4>
                <p>{description}</p>
              </RadixDialog.Title>
              <div>{children}</div>
              <div className="space-y-3">
                {onConfirm ? (
                  <Button
                    className="w-full"
                    disabled={isPerformingAction}
                    loading={isPerformingAction}
                    onClick={() => onConfirm()}
                    size="lg"
                  >
                    {confirmText}
                  </Button>
                ) : null}
                <Button
                  className="w-full"
                  disabled={isPerformingAction}
                  onClick={onClose}
                  outline
                  size="lg"
                >
                  {cancelText}
                </Button>
              </div>
            </div>
          </RadixDialog.Content>
        </div>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default memo(Alert);
