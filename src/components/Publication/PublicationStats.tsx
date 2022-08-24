import Collectors from '@components/Shared/Collectors';
import { Modal } from '@components/UI/Modal';
import { LensterPublication } from '@generated/lenstertypes';
import { CollectionIcon } from '@heroicons/react/outline';
import nFormatter from '@lib/nFormatter';
import React, { FC, useState } from 'react';

interface Props {
  publication: LensterPublication;
}

const PublicationStats: FC<Props> = ({ publication }) => {
  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  const isMirror = publication?.__typename === 'Mirror';
  const mirrorCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const reactionCount = isMirror
    ? publication?.mirrorOf?.stats?.totalUpvotes
    : publication?.stats?.totalUpvotes;
  const collectCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfCollects
    : publication?.stats?.totalAmountOfCollects;

  return (
    <div className="flex flex-wrap gap-6 text-sm items-center py-3 text-gray-500 sm:gap-8">
      {mirrorCount > 0 && (
        <button onClick={() => setShowMirrorsModal(true)}>
          <b className="text-black dark:text-white">{nFormatter(mirrorCount)}</b> Mirrors
        </button>
      )}
      {reactionCount > 0 && (
        <button onClick={() => setShowLikesModal(true)}>
          <b className="text-black dark:text-white">{nFormatter(reactionCount)}</b> Likes
        </button>
      )}
      {collectCount > 0 && (
        <>
          <button onClick={() => setShowCollectorsModal(true)}>
            <b className="text-black dark:text-white">{nFormatter(collectCount)}</b> Collects
          </button>
          <Modal
            title="Collectors"
            icon={<CollectionIcon className="w-5 h-5 text-brand" />}
            show={showCollectorsModal}
            onClose={() => setShowCollectorsModal(false)}
          >
            <Collectors
              pubId={publication?.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default PublicationStats;
