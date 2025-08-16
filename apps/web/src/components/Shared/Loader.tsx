import { Spinner } from "@/components/Shared/UI";
import cn from "@/helpers/cn";

interface LoaderProps {
  className?: string;
  message?: string;
  small?: boolean;
}

const Loader = ({ className = "", message, small = false }: LoaderProps) => {
  return (
    <div className={cn("space-y-2 text-center font-bold", className)}>
      <Spinner className="mx-auto" size={small ? "sm" : "md"} />
      {message && <div className={cn({ "text-sm": small })}>{message}</div>}
    </div>
  );
};

export default Loader;
