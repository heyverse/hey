import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import Link from 'next/link';
import type { FC } from 'react';

import Slug from './Slug';

interface UsernameProps {
  profile: Profile;
  className?: string;
}

const Username: FC<UsernameProps> = ({ profile, className }) => {
  return (
    <Link href={`/u/${formatHandle(profile?.handle)}`} className={className}>
      {profile?.name ? <b>{profile?.name}</b> : <Slug slug={formatHandle(profile?.handle)} prefix="@" />}
    </Link>
  );
};

export default Username;
