import ToggleWrapper from "@components/Staff/Accounts/Overview/Tool/ToggleWrapper";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Permission, PermissionId } from "@hey/data/permissions";
import getInternalAccount, {
  GET_INTERNAL_ACCOUNT_QUERY_KEY
} from "@hey/helpers/api/getInternalAccount";
import type { AccountFragment } from "@hey/indexer";
import { Toggle } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CreatorToolProps {
  account: AccountFragment;
}

const CreatorTool: FC<CreatorToolProps> = ({ account }) => {
  const [updating, setUpdating] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const allowedPermissions = [
    { id: PermissionId.Verified, key: Permission.Verified },
    { id: PermissionId.StaffPick, key: Permission.StaffPick }
  ];

  const { data: preferences, isLoading } = useQuery({
    queryFn: () => getInternalAccount(account.address, getAuthApiHeaders()),
    queryKey: [GET_INTERNAL_ACCOUNT_QUERY_KEY, account.address]
  });

  useEffect(() => {
    if (preferences) {
      setPermissions(preferences.permissions || []);
    }
  }, [preferences]);

  const togglePermission = useCallback(
    async (permission: { id: string; key: string }) => {
      const { id, key } = permission;
      const enabled = !permissions.includes(key);

      try {
        setUpdating(true);
        await axios.post(
          `${HEY_API_URL}/internal/creator-tools/assign`,
          { enabled, id, accountAddress: account.address },
          { headers: getAuthApiHeaders() }
        );

        toast.success("Permission updated");
        setPermissions((prev) =>
          enabled ? [...prev, key] : prev.filter((f) => f !== key)
        );
      } catch (error) {
        errorToast(error);
      } finally {
        setUpdating(false);
      }
    },
    [permissions, account.address]
  );

  return (
    <div className="space-y-2.5">
      <div className="font-bold">Creator Tool</div>
      <div className="space-y-2 pt-2 font-bold">
        {allowedPermissions.map((permission) => (
          <ToggleWrapper key={permission.id} title={permission.key}>
            <Toggle
              disabled={updating || isLoading}
              on={permissions.includes(permission.key)}
              setOn={() => togglePermission(permission)}
            />
          </ToggleWrapper>
        ))}
      </div>
    </div>
  );
};

export default CreatorTool;
