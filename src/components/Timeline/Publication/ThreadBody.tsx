import UserProfile from '@components/Shared/UserProfile';
import type { LensterPublication } from '@generated/lenstertypes';
import type { FeedItem } from '@generated/types';
import { Mixpanel } from '@lib/mixpanel';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';

dayjs.extend(relativeTime);

interface Props {
  publication: LensterPublication;
  feedItem: FeedItem;
}

const ThreadBody: FC<Props> = ({ publication, feedItem }) => {
  const { push } = useRouter();
  const profile = publication?.profile;
  const timestamp = publication?.createdAt;

  return (
    <article>
      <div className="flex justify-between space-x-1.5">
        <span onClick={(event) => event.stopPropagation()}>
          <UserProfile profile={profile ?? publication?.collectedBy?.defaultProfile} />
        </span>
        <span className="text-xs text-gray-500">{dayjs(new Date(timestamp)).fromNow()}</span>
      </div>
      <div className="flex">
        <div className="mr-8 ml-5 bg-gray-300 border-gray-300 dark:bg-gray-700 dark:border-gray-700 border-[0.8px] -my-[3px]" />
        <div
          className="pt-4 pb-5 w-[85%] sm:w-full"
          onClick={() => {
            push(`/posts/${publication?.id}`);
            Mixpanel.track(PUBLICATION.OPEN);
          }}
        >
          {publication?.hidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <PublicationActions publication={publication} />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default ThreadBody;
