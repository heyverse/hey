import errorToast from "@/helpers/errorToast";
import { trpc } from "@/helpers/trpc";
import { Permission, PermissionId } from "@hey/data/permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ToggleWithHelper from "../ToggleWithHelper";

interface SuspendProps {
  address: string;
}

const Suspend = ({ address }: SuspendProps) => {
  const { data: account, isLoading } = useQuery(
    trpc.internal.account.queryOptions({ address })
  );

  const { mutate } = useMutation(
    trpc.internal.permissions.assign.mutationOptions({
      onSuccess: () => toast.success("Account suspended"),
      onError: errorToast
    })
  );

  const isSuspended =
    account?.permissions.includes(Permission.Suspended) || false;

  return (
    <div className="text-red-500">
      <ToggleWithHelper
        heading="Suspend Account"
        disabled={isLoading}
        on={isSuspended}
        setOn={() =>
          mutate({
            account: address,
            enabled: true,
            permission: PermissionId.Suspended
          })
        }
      />
    </div>
  );
};

export default Suspend;
