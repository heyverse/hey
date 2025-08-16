import { Button, H3 } from "@/components/Shared/UI";
import clearLocalStorage from "@/helpers/clearLocalStorage";

interface SiteErrorProps {
  message?: string;
}

const SiteError = ({ message }: SiteErrorProps) => {
  const clearLocalData = () => {
    clearLocalStorage();
    setTimeout(() => location.reload(), 200);
  };

  return (
    <div className="p-10 text-center">
      <H3 className="mb-4">Looks like something went wrong!</H3>
      <div className="mb-4 text-gray-500 dark:text-gray-200">
        We track these errors automatically, but if the problem persists feel
        free to contact us. In the meantime, try refreshing.
      </div>
      {message && (
        <div className="mx-auto my-10 w-fit max-w-md rounded-lg bg-black p-3 font-mono text-white text-xs">
          {message}
        </div>
      )}
      <Button
        className="mx-auto flex items-center"
        onClick={() => clearLocalData()}
      >
        Clear cache and refresh
      </Button>
    </div>
  );
};

export default SiteError;
