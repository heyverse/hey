import JoinLeaveButton from "@/components/Shared/Group/JoinLeaveButton";
import Markup from "@/components/Shared/Markup";
import { Button, H3, Image, LightBox } from "@/components/Shared/UI";
import getMentions from "@/helpers/getMentions";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { TRANSFORMS } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import type { GroupFragment } from "@hey/indexer";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import MembersCount from "./MembersCount";

interface DetailsProps {
  group: GroupFragment;
}

const Details = ({ group }: DetailsProps) => {
  const navigate = useNavigate();
  const { currentAccount } = useAccountStore();
  const [showLightBox, setShowLightBox] = useState<boolean>(false);

  const handleShowLightBox = useCallback(() => {
    setShowLightBox(true);
  }, []);

  const handleCloseLightBox = useCallback(() => {
    setShowLightBox(false);
  }, []);

  return (
    <div className="mb-4 space-y-3 px-5 md:px-0">
      <div className="flex items-start justify-between">
        <div className="-mt-24 sm:-mt-24 relative ml-5 size-32 sm:size-36">
          <Image
            alt={group.address}
            className="size-32 cursor-pointer rounded-xl bg-gray-200 ring-3 ring-gray-50 sm:size-36 dark:bg-gray-700 dark:ring-black"
            height={128}
            onClick={handleShowLightBox}
            src={getAvatar(group, TRANSFORMS.AVATAR_BIG)}
            width={128}
          />
          <LightBox
            onClose={handleCloseLightBox}
            show={showLightBox}
            images={[getAvatar(group, TRANSFORMS.EXPANDED_AVATAR)]}
          />
        </div>
        {currentAccount?.address === group.owner ? (
          <>
            <Button
              onClick={() => navigate(`/g/${group.address}/settings`)}
              outline
            >
              Edit Group
            </Button>
          </>
        ) : (
          <JoinLeaveButton group={group} />
        )}
      </div>
      <H3 className="truncate py-2">{group.metadata?.name}</H3>
      {group.metadata?.description ? (
        <div className="markup linkify mr-0 break-words sm:mr-10">
          <Markup mentions={getMentions(group.metadata?.description)}>
            {group.metadata?.description}
          </Markup>
        </div>
      ) : null}
      <MembersCount group={group} />
    </div>
  );
};

export default Details;
