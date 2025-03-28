import { H5 } from "@/components/Shared/UI";
import { FlagIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import UpdatePermissions from "./UpdatePermissions";

interface PermissionsProps {
  permissions: string[];
  accountAddress: string;
}

const Permissions = ({ permissions, accountAddress }: PermissionsProps) => {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    setKeys(permissions);
  }, [permissions]);

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <FlagIcon className="size-5" />
        <H5>Permissions</H5>
      </div>
      <div className="mt-3">
        <UpdatePermissions
          permissions={keys}
          accountAddress={accountAddress}
          setPermissions={setKeys}
        />
      </div>
    </>
  );
};

export default Permissions;
