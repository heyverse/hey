import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import { signOut } from "@/store/persisted/useAuthStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

interface LogoutProps {
  className?: string;
  onClick?: () => void;
}

const Logout = ({ className = "", onClick }: LogoutProps) => {
  const { resetPreferences } = usePreferencesStore();

  const handleLogout = async () => {
    try {
      resetPreferences();
      signOut();
      location.reload();
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <button
      className={cn(
        "flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-gray-700 text-sm dark:text-gray-200",
        className
      )}
      onClick={async () => {
        await handleLogout();
        onClick?.();
      }}
      type="button"
    >
      <ArrowRightStartOnRectangleIcon className="size-4" />
      <div>Logout</div>
    </button>
  );
};

export default Logout;
