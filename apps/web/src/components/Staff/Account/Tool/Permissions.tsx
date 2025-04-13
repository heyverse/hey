import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { H5 } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { hono } from "@/helpers/fetcher";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { Permission, PermissionId } from "@hey/data/permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PermissionsProps {
  address: string;
}

const Permissions = ({ address }: PermissionsProps) => {
  const { data: account, isLoading } = useQuery({
    queryFn: () => hono.internal.account.get(address),
    queryKey: ["account", address]
  });

  const { mutate } = useMutation({
    mutationFn: ({
      account,
      enabled,
      permission
    }: { account: string; enabled: boolean; permission: PermissionId }) =>
      hono.internal.permissions.assign({ account, enabled, permission }),
    onSuccess: () => toast.success("Account suspended"),
    onError: errorToast
  });

  const isSuspended =
    account?.permissions.includes(Permission.Suspended) || false;

  return (
    <>
      <div className="divider my-5 border-yellow-600 border-dashed" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <AdjustmentsHorizontalIcon className="size-5" />
        <H5>Permissions</H5>
      </div>
      <div className="mt-3 space-y-2">
        <div className="text-red-500">
          <ToggleWithHelper
            heading="Suspend Account"
            disabled={isLoading}
            on={isSuspended}
            setOn={() =>
              mutate({
                account: address,
                enabled: !isSuspended,
                permission: PermissionId.Suspended
              })
            }
          />
        </div>
      </div>
    </>
  );
};

export default Permissions;
