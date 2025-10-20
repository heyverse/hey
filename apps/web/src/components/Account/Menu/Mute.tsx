import { MenuItem } from "@headlessui/react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import type { AccountFragment } from "@hey/indexer";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useMuteAlertStore } from "@/store/non-persisted/alert/useMuteAlertStore";

interface MuteProps {
  account: AccountFragment;
}

const Mute = ({ account }: MuteProps) => {
  const { setShowMuteOrUnmuteAlert } = useMuteAlertStore();
  const isMutedByMe = account.operations?.isMutedByMe;

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowMuteOrUnmuteAlert(true, account);
      }}
    >
      {isMutedByMe ? (
        <SpeakerWaveIcon className="size-4" />
      ) : (
        <SpeakerXMarkIcon className="size-4" />
      )}
      <div>
        {isMutedByMe ? "Unmute" : "Mute"} {getAccount(account).username}
      </div>
    </MenuItem>
  );
};

export default Mute;
