import 'plyr-react/plyr.css';

import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '@hey/data/constants';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Player } from '@livepeer/react';
import type { FC } from 'react';
import { memo } from 'react';
import { useAppStore } from 'src/store/useAppStore';

interface VideoProps {
  src: string;
  poster?: string;
  className?: string;
}

const Video: FC<VideoProps> = ({ src, poster, className = '' }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className={cn('lp-player', className)} onClick={stopEventPropagation}>
      <Player
        src={src}
        poster={imageKit(sanitizeDStorageUrl(poster))}
        objectFit="contain"
        showLoadingSpinner
        showUploadingIndicator
        showPipButton={false}
        viewerId={currentProfile?.ownedBy.address}
        controls={{ defaultVolume: 1 }}
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: IPFS_GATEWAY,
          arweaveGateway: ARWEAVE_GATEWAY
        }}
      />
    </div>
  );
};

export default memo(Video);
