import { CheckCircleIcon as CheckCircleIconOutline } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ProFeatureNotice from "@/components/Shared/ProFeatureNotice";
import { Image, Tooltip } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { hono } from "@/helpers/fetcher";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";

const icons = [
  { id: 0, name: "Default" },
  { id: 1, name: "Pride" },
  { id: 2, name: "Emerald" },
  { id: 3, name: "Indigo" },
  { id: 4, name: "Violet" }
];

const AppIcon = () => {
  const { currentAccount } = useAccountStore();
  const { appIcon, setAppIcon } = usePreferencesStore();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ appIcon }: { appIcon: number }) =>
      hono.preferences.update({ appIcon }),
    onError: errorToast,
    onSuccess: (data) => {
      setAppIcon(data.appIcon ?? 0);
      toast.success("App icon updated");
    }
  });

  const handleSelectIcon = (iconId: number) => {
    mutate({ appIcon: iconId });
  };

  if (!currentAccount?.hasSubscribed) {
    return <ProFeatureNotice className="m-5" feature="custom app icons" />;
  }

  return (
    <div className="m-5 flex flex-col gap-y-5">
      <b>Choose App Icon</b>
      <div className="flex flex-wrap items-center gap-x-8">
        {icons.map((icon) => (
          <Tooltip content={icon.name} key={icon.id} placement="top">
            <button
              className="flex flex-col items-center space-y-2"
              disabled={isPending}
              onClick={() => handleSelectIcon(icon.id)}
              type="button"
            >
              <Image
                alt={icon.name}
                className="size-10"
                height={40}
                src={`${STATIC_IMAGES_URL}/app-icon/${icon.id}.png`}
                width={40}
              />
              {icon.id === appIcon ? (
                <CheckCircleIconSolid className="size-5 text-green-600" />
              ) : (
                <CheckCircleIconOutline className="size-5 text-gray-500 dark:text-gray-200" />
              )}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default AppIcon;
