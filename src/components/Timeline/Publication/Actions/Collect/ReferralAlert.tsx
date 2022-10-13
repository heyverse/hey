import Slug from '@components/Shared/Slug';
import type { ElectedMirror } from '@generated/types';
import { HeartIcon } from '@heroicons/react/solid';
import type { FC } from 'react';

interface Props {
  electedMirror: ElectedMirror;
  referralFee?: number;
}

const ReferralAlert: FC<Props> = ({ electedMirror, referralFee = 0 }) => {
  if (!electedMirror || referralFee === 0) {
    return null;
  }

  return (
    <div className="flex items-center pt-1 space-x-1.5 text-sm text-gray-500">
      <HeartIcon className="w-4 h-4 text-pink-500" />
      <Slug slug={electedMirror?.profile?.handle} prefix="@" />
      <span>
        {' '}
        will get <b>{referralFee}%</b> referral fee
      </span>
    </div>
  );
};

export default ReferralAlert;
