import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo } from "react";
import cn from "@/helpers/cn";

const thumbVariants = cva(
  "block bg-gray-900 focus:outline-hidden active:scale-110",
  {
    defaultVariants: { showValueInThumb: false },
    variants: {
      showValueInThumb: {
        false: "size-5 rounded-full",
        true: "rounded-lg px-2 py-1 font-bold text-white text-xs"
      }
    }
  }
);

interface RangeSliderProps
  extends SliderPrimitive.SliderProps,
    VariantProps<typeof thumbVariants> {
  className?: string;
  displayValue?: string;
}

const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ className = "", displayValue, showValueInThumb, ...rest }, ref) => {
    return (
      <SliderPrimitive.Root
        className={cn(
          "relative flex h-5 w-full touch-none select-none items-center",
          className
        )}
        max={100}
        ref={ref}
        step={1}
        {...rest}
      >
        <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-gray-200 dark:bg-gray-800">
          <SliderPrimitive.Range className="absolute h-full rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Slider"
          className={thumbVariants({ showValueInThumb })}
        >
          {showValueInThumb ? displayValue || rest.value : null}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  }
);

export default memo(RangeSlider);
