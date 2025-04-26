import cn from "@/helpers/cn";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
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
  const currentImage = images[currentIndex];

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsLoading(true);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    if (show) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onClose, currentIndex]);

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
                  "fixed top-1/2 left-4 z-50 rounded-full bg-black/50 p-2 text-white md:left-6 md:p-3",
                  currentIndex === 0
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-black/70"
                )}
                type="button"
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
                className={cn(
                  "fixed top-1/2 right-4 z-50 rounded-full bg-black/50 p-2 text-white md:right-6 md:p-3",
                  currentIndex === images.length - 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-black/70"
                )}
                type="button"
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </>
          )}
          <img
            alt={`${currentIndex + 1} of ${images.length}`}
            className="max-h-[90vh] max-w-fit cursor-zoom-in touch-manipulation select-none object-contain"
            onClick={() => window.open(currentImage, "_blank")}
            src={currentImage}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            width={1000}
            height={1000}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
