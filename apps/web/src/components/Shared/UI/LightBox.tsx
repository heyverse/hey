import cn from "@/helpers/cn";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./Spinner";

interface LightBoxProps {
  show: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export const LightBox = ({
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

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
        setIsLoading(true);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
        setIsLoading(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const next = Math.min(prev + 1, images.length - 1);
      if (next !== prev) setIsLoading(true);
      return next;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const prevIndex = Math.max(prev - 1, 0);
      if (prevIndex !== prev) setIsLoading(true);
      return prevIndex;
    });
  };

  return (
    <Dialog open={show} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm dark:bg-gray-900/80"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="md" className="text-white" />
            </div>
          )}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={cn(
                  "fixed top-1/2 left-4 rounded-full bg-black/50 p-2 text-white md:left-6 md:p-3",
                  { "cursor-not-allowed opacity-50": currentIndex === 0 }
                )}
                type="button"
              >
                <ArrowLeftIcon className="size-6" />
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
                className={cn(
                  "fixed top-1/2 right-4 rounded-full bg-black/50 p-2 text-white md:right-6 md:p-3",
                  {
                    "cursor-not-allowed opacity-50":
                      currentIndex === images.length - 1
                  }
                )}
                type="button"
              >
                <ArrowRightIcon className="size-6" />
              </button>
            </>
          )}
          <img
            alt={`${currentIndex + 1} of ${images.length}`}
            src={currentImage}
            loading="lazy"
            draggable={false}
            className="max-h-[90vh] w-auto max-w-full cursor-zoom-in touch-manipulation select-none object-contain"
            onClick={() => window.open(currentImage, "_blank", "noopener")}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
