import cn from "@/helpers/cn";

interface SlugProps {
  className?: string;
  prefix?: string;
  slug: string;
  useBrandColor?: boolean;
}

const Slug = ({
  className = "",
  prefix = "",
  slug,
  useBrandColor = false
}: SlugProps) => {
  return (
    <span
      className={cn(
        useBrandColor ? "text-brand-500" : "text-gray-500 dark:text-gray-200",
        className
      )}
    >
      {prefix}
      {slug}
    </span>
  );
};

export default Slug;
