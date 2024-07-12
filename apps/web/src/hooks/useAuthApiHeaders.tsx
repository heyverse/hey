import { IS_MAINNET } from '@hey/data/constants';
import parseJwt from '@hey/helpers/parseJwt';

import { useAuthStore } from '../store/persisted/useAuthStore';

interface LensAuthData {
  authorizationId: null | string;
  evmAddress: null | string;
  id: null | string;
  'X-Access-Token': null | string;
  'X-Identity-Token': null | string;
  'X-Lens-Network': string;
  'X-Refresh-Token': null | string;
}

const useLensAuthData = (): LensAuthData => {
  const { accessToken, identityToken, refreshToken } = useAuthStore();
  const currentSession = parseJwt(accessToken || '');

  return {
    authorizationId: currentSession?.authorizationId,
    evmAddress: currentSession?.evmAddress,
    id: currentSession?.id,
    'X-Access-Token': accessToken,
    'X-Identity-Token': identityToken,
    'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'testnet',
    'X-Refresh-Token': refreshToken
  };
};

export default useLensAuthData;
