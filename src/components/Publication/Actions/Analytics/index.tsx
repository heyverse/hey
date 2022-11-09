import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import type { LensterPublication } from '@generated/lenstertypes';
import { ChartBarIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

import Stats from './Stats';

interface Props {
  publication: LensterPublication;
  isFullPublication: boolean;
}

const Analytics: FC<Props> = ({ publication, isFullPublication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showCollectModal, setShowCollectModal] = useState(false);

  const profileIdFromPublication = publication?.id.split('-')[0];
  const showAnalytics = currentProfile?.id === profileIdFromPublication;

  if (!showAnalytics || publication.__typename === 'Mirror') {
    return null;
  }

  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShowCollectModal(true);
          // Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
        }}
        aria-label="Analytics"
      >
        <span className="flex items-center space-x-1 text-indigo-500">
          <span className="p-1.5 rounded-full hover:bg-indigo-300 hover:bg-opacity-20">
            <Tooltip placement="top" content="Analytics" withDelay>
              <ChartBarIcon className={iconClassName} />
            </Tooltip>
          </span>
        </span>
      </motion.button>
      <Modal
        title="Publication Analytics"
        icon={<ChartBarIcon className="text-brand h-5 w-5" />}
        show={showCollectModal}
        onClose={() => setShowCollectModal(false)}
      >
        <Stats publication={publication} />
      </Modal>
    </>
  );
};

export default Analytics;
