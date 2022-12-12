import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { CollectionIcon, UsersIcon } from '@heroicons/react/outline';
import type { Dispatch, FC } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';

interface Props {
  setShowModal: Dispatch<boolean>;
}

const BasicSettings: FC<Props> = ({ setShowModal }) => {
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const reset = useAccessSettingsStore((state) => state.reset);
  const setRestricted = useAccessSettingsStore((state) => state.setRestricted);
  const followToView = useAccessSettingsStore((state) => state.followToView);
  const setFollowToView = useAccessSettingsStore((state) => state.setFollowToView);
  const collectToView = useAccessSettingsStore((state) => state.collectToView);
  const setCollectToView = useAccessSettingsStore((state) => state.setCollectToView);

  return (
    <div className="p-5">
      <ToggleWithHelper
        on={restricted}
        setOn={() => {
          if (!restricted) {
            reset();
          }
          setRestricted(!restricted);
        }}
        label="Add restrictions on who can view this post"
      />
      {restricted && (
        <>
          <Card className="p-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CollectionIcon className="h-4 w-4 text-brand-500" />
                <span>Collectors can view</span>
              </div>
              <ToggleWithHelper
                on={collectToView}
                setOn={() => setCollectToView(!collectToView)}
                label="People need to collect it first to be able to view it"
              />
            </div>
          </Card>
          <Card className="p-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-4 w-4 text-brand-500" />
                <span>Followers can view</span>
              </div>
              <ToggleWithHelper
                on={followToView}
                setOn={() => setFollowToView(!followToView)}
                label="People need to follow you to be able to view it"
              />
            </div>
          </Card>
        </>
      )}
      <div className="pt-5 flex space-x-2">
        <Button
          className="ml-auto"
          variant="danger"
          outline
          onClick={() => {
            reset();
            setShowModal(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={() => setShowModal(false)}>Save</Button>
      </div>
    </div>
  );
};

export default BasicSettings;
