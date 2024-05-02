import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';

import { type FC } from 'react';

import CreatePublicationEmbed from './CreatePublicationEmbed';
import FeedEmbed from './FeedEmbed';

export const OPEN_ACTION_EMBED_TOOLTIP = 'Open action embedded';
export const OPEN_ACTION_NO_EMBED_TOOLTIP = 'Unable to embed open action';

export const openActionCTA = (platformName?: string): string => {
  const name = platformName || '';
  const platform = name.toLowerCase();
  return ['opensea', 'rarible', 'superrare'].includes(platform)
    ? 'Buy'
    : 'Mint';
};
interface DecentOpenActionProps {
  isFullPublication?: boolean;
  mirrorPublication?: AnyPublication;
  og: OG;
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
  publication?: AnyPublication;
}

const DecentOpenAction: FC<DecentOpenActionProps> = ({
  mirrorPublication,
  og,
  openActionEmbed,
  openActionEmbedLoading,
  publication
}) => {
  if (!publication) {
    return (
      <CreatePublicationEmbed
        og={og}
        openActionEmbed={openActionEmbed}
        openActionEmbedLoading={openActionEmbedLoading}
      />
    );
  }
  return (
    <FeedEmbed
      mirrorPublication={mirrorPublication}
      og={og}
      openActionEmbed={openActionEmbed}
      openActionEmbedLoading={openActionEmbedLoading}
      publication={publication}
    />
  );
};

export default DecentOpenAction;
