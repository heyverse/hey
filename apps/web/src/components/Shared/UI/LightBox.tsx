import { Dialog, DialogPanel } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { memo, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Spinner } from "@/components/Shared/UI";
import cn from "@/helpers/cn";

interface LightBoxProps {
  show: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

const LightBox = ({
  show,
  onClose,
  images,
  initialIndex = 0
}: LightBoxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  const currentImage = useMemo(
    () => images[currentIndex],
    [images, currentIndex]
  );

  useEffect(() => {
    if (show) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
    }
  }, [show, initialIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = Math.min(prev + 1, images.length - 1);
      if (next !== prev) setIsLoading(true);
      return next;
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const prevIndex = Math.max(prev - 1, 0);
      if (prevIndex !== prev) setIsLoading(true);
      return prevIndex;
    });
  };

  useHotkeys("escape", onClose, { enabled: show });
  useHotkeys("arrowright", handleNext, { enabled: show });
  useHotkeys("arrowleft", handlePrevious, { enabled: show });

  return (
    <Dialog className="relative z-50" onClose={onClose} open={show}>
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm dark:bg-gray-900/80"
      />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="text-white" size="md" />
            </div>
          )}
          {images.length > 1 && (
            <>
              <button
                className={cn(
                  "fixed top-1/2 left-4 rounded-full bg-black/50 p-2 text-white md:left-6 md:p-3",
                  { "cursor-not-allowed opacity-50": currentIndex === 0 }
                )}
                disabled={currentIndex === 0}
                onClick={handlePrevious}
                type="button"
              >
                <ArrowLeftIcon className="size-6" />
              </button>
              <button
                className={cn(
                  "fixed top-1/2 right-4 rounded-full bg-black/50 p-2 text-white md:right-6 md:p-3",
                  {
                    "cursor-not-allowed opacity-50":
                      currentIndex === images.length - 1
                  }
                )}
                disabled={currentIndex === images.length - 1}
                onClick={handleNext}
                type="button"
              >
                <ArrowRightIcon className="size-6" />
              </button>
            </>
          )}
          <img
            alt={`${currentIndex + 1} of ${images.length}`}
            className="max-h-[90vh] w-auto max-w-full cursor-zoom-in touch-manipulation select-none object-contain"
            draggable={false}
            loading="lazy"
            onClick={() => window.open(currentImage, "_blank", "noopener")}
            onError={() => setIsLoading(false)}
            onLoad={() => setIsLoading(false)}
            src={currentImage}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default memo(LightBox);
