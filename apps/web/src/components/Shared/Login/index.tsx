import WalletSelector from '@components/Shared/Login/WalletSelector';
import { APP_NAME, IS_MAINNET, STATIC_IMAGES_URL } from '@hey/data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

import NewProfile from './New';

const Login: FC = () => {
  const [hasConnected, setHasConnected] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);

  return (
    <div className="p-5">
      {hasProfile ? (
        <div className="space-y-5">
          {hasConnected ? (
            <div className="space-y-1">
              <div className="text-xl font-bold">Please sign the message.</div>
              <div className="lt-text-gray-500 text-sm">
                {APP_NAME} uses this signature to verify that you're the owner
                of this address.
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xl font-bold">Connect your wallet.</div>
              <div className="lt-text-gray-500 text-sm">
                Connect with one of our available wallet providers or create a
                new one.
              </div>
            </div>
          )}
          <WalletSelector
            setHasConnected={setHasConnected}
            setHasProfile={setHasProfile}
          />
        </div>
      ) : IS_MAINNET ? (
        <div className="mb-2 space-y-4">
          <img
            className="h-16 w-16 rounded-full"
            height={64}
            width={64}
            src={`${STATIC_IMAGES_URL}/brands/lens.png`}
            alt="Logo"
          />
          <div className="text-xl font-bold">Claim your Lens profile 🌿</div>
          <div className="space-y-1">
            <div className="linkify">
              Visit{' '}
              <Link
                className="font-bold"
                href="https://claim.lens.xyz"
                target="_blank"
                rel="noreferrer noopener"
              >
                claiming site
              </Link>{' '}
              to claim your profile now 🏃‍♂️
            </div>
            <div className="lt-text-gray-500 text-sm">
              Make sure to check back here when done!
            </div>
          </div>
        </div>
      ) : (
        <NewProfile isModal />
      )}
    </div>
  );
};

export default Login;
