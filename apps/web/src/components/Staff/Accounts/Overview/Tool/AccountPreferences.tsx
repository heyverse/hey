import MetaDetails from "@components/Shared/MetaDetails";
import { BellIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  Cog6ToothIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import type { Preferences } from "@hey/types/hey";
import { H5 } from "@hey/ui";
import type { FC } from "react";

interface AccountPreferencesProps {
  preferences: Preferences;
}

const AccountPreferences: FC<AccountPreferencesProps> = ({ preferences }) => {
  if (!preferences) {
    return null;
  }

  return (
    <>
      <div className="divider my-5 border-yellow-600 border-dashed" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <Cog6ToothIcon className="size-5" />
        <H5>Account Preferences</H5>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<CursorArrowRaysIcon className="ld-text-gray-500 size-4" />}
          title="App Icon"
        >
          <img
            className="size-4"
            height={16}
            alt="Logo"
            src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
            width={16}
          />
        </MetaDetails>
        <MetaDetails
          icon={<BellIcon className="ld-text-gray-500 size-4" />}
          title="High signal notification filter"
        >
          {preferences.includeLowScore ? (
            <CheckCircleIcon className="size-4 text-green-500" />
          ) : (
            <XCircleIcon className="size-4 text-red-500" />
          )}
        </MetaDetails>
      </div>
    </>
  );
};

export default AccountPreferences;
