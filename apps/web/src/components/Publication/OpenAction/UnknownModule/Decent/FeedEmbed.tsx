import type {
  AnyPublication,
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { OG } from '@hey/types/misc';
import type { PublicationInfo } from 'nft-openaction-kit';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';
import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import getNftOpenActionKit from '@helpers/getNftOpenActionKit';
import { Leafwatch } from '@helpers/leafwatch';
import { ZERO_ADDRESS } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import sanitizeDStorageUrl from '@hey/helpers/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Card, Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useQuery } from '@tanstack/react-query';
import { type FC, useEffect, useState } from 'react';
import { HEY_REFERRAL_PROFILE_ID } from 'src/constants';
import { useNftOaCurrencyStore } from 'src/store/persisted/useNftOaCurrencyStore';
import { useAccount } from 'wagmi';

import { OPEN_ACTION_EMBED_TOOLTIP, openActionCTA } from '.';
import DecentOpenActionModule from './Module';

const formatPublicationData = (
  targetPublication: MirrorablePublication
): PublicationInfo => {
  const [profileId, pubId] = targetPublication.id.split('-');

  const unknownModules =
    targetPublication.openActionModules as UnknownOpenActionModuleSettings[];
  const actionModules = unknownModules.map(
    (module) => module.contract.address
  ) as string[];
  const actionModulesInitDatas = unknownModules.map(
    (module) => module.initializeCalldata
  ) as string[];

  return {
    actionModules,
    actionModulesInitDatas,
    profileId: parseInt(profileId, 16).toString(),
    pubId: parseInt(pubId, 16).toString()
  };
};

interface DecentOpenActionProps {
  isFullPublication?: boolean;
  mirrorPublication?: AnyPublication;
  og: OG;
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
  publication: AnyPublication;
}

const FeedEmbed: FC<DecentOpenActionProps> = ({
  mirrorPublication,
  og,
  openActionEmbed,
  openActionEmbedLoading,
  publication
}) => {
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const { selectedNftOaCurrency } = useNftOaCurrencyStore();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { address } = useAccount();

  const [nft, setNft] = useState({
    chain: og.nft?.chain || null,
    collectionName: og.nft?.collectionName || '',
    contractAddress: og.nft?.contractAddress || ZERO_ADDRESS,
    creatorAddress: og.nft?.creatorAddress || ZERO_ADDRESS,
    description: og.description || '',
    endTime: null,
    mediaUrl: og.nft?.mediaUrl || og.image || '',
    mintCount: null,
    mintStatus: null,
    mintUrl: null,
    schema: og.nft?.schema || '',
    sourceUrl: og.url
  });

  const fetchActionData = async () => {
    const nftOpenActionKit = getNftOpenActionKit();
    const pubInfo = formatPublicationData(targetPublication);

    const actionDataResult = await nftOpenActionKit.actionDataFromPost({
      executingClientProfileId: HEY_REFERRAL_PROFILE_ID,
      mirrorerProfileId: mirrorPublication?.by.id,
      mirrorPubId: mirrorPublication?.id,
      paymentToken: selectedNftOaCurrency,
      post: pubInfo,
      profileId: targetPublication.by.id,
      profileOwnerAddress: targetPublication.by.ownedBy.address,
      quantity: selectedQuantity,
      senderAddress: address || ZERO_ADDRESS,
      sourceUrl: og.url,
      srcChainId: '137'
    });

    return actionDataResult;
  };

  const {
    data: actionData,
    isLoading: loadingActionData,
    refetch
  } = useQuery({
    enabled:
      !!module && !!selectedNftOaCurrency && !!address && !!targetPublication,
    queryFn: fetchActionData,
    queryKey: [
      'actionData',
      selectedNftOaCurrency,
      selectedQuantity,
      address,
      targetPublication?.id
    ]
  });

  useEffect(() => {
    if (actionData) {
      setNft((prevNft) => ({
        ...prevNft,
        chain: actionData.uiData.dstChainId.toString() || prevNft.chain,
        collectionName: actionData.uiData.nftName || prevNft.collectionName,
        creatorAddress:
          `0x${actionData.uiData.nftCreatorAddress}` || prevNft.creatorAddress,
        mediaUrl:
          sanitizeDStorageUrl(actionData.uiData.nftUri) || prevNft.mediaUrl,
        schema: actionData.uiData.tokenStandard || prevNft.schema
      }));
    }
  }, [actionData]);

  useEffect(() => {
    refetch();
  }, [selectedNftOaCurrency, address, refetch]);

  const [isNftCoverLoaded, setIsNftCoverLoaded] = useState(false);

  if (!module) {
    return null;
  }

  return (
    <>
      <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
        <div className="relative">
          <img
            alt={nft.mediaUrl.length ? nft.collectionName : undefined}
            className={cn(
              'h-[350px] max-h-[350px] w-full rounded-t-xl object-contain',
              isNftCoverLoaded ? 'visible' : 'invisible'
            )}
            onLoad={() => setIsNftCoverLoaded(true)}
            src={nft.mediaUrl.length ? nft.mediaUrl : undefined}
          />
        </div>
        {!!actionData && nft && !loadingActionData ? (
          <div className="flex flex-col items-start justify-between gap-4 border-t p-4 sm:flex-row sm:items-center sm:gap-0 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {nft.creatorAddress ? (
                <ActionInfo
                  actionData={actionData}
                  collectionName={nft.collectionName}
                  creatorAddress={nft.creatorAddress}
                  uiData={actionData.uiData}
                />
              ) : null}
            </div>

            {openActionEmbedLoading ? (
              <Spinner size="xs" />
            ) : openActionEmbed ? (
              <Tooltip
                content={<span>{OPEN_ACTION_EMBED_TOOLTIP}</span>}
                placement="top"
              >
                <Button
                  className="w-full text-base font-normal sm:w-auto"
                  size="lg"
                >
                  {openActionCTA(actionData.uiData.platformName)}
                </Button>
              </Tooltip>
            ) : (
              <Button
                className="w-full text-base font-normal sm:w-auto"
                onClick={() => {
                  setShowOpenActionModal(true);
                  Leafwatch.track(PUBLICATION.OPEN_ACTIONS.DECENT.OPEN_DECENT, {
                    publication_id: publication.id
                  });
                }}
                size="lg"
              >
                {openActionCTA(actionData.uiData.platformName)}
              </Button>
            )}
          </div>
        ) : loadingActionData ? (
          <DecentOpenActionShimmer />
        ) : null}
      </Card>
      <DecentOpenActionModule
        actionData={actionData}
        loadingCurrency={loadingActionData}
        module={module as UnknownOpenActionModuleSettings}
        nft={nft}
        onClose={() => setShowOpenActionModal(false)}
        publication={targetPublication}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        show={showOpenActionModal}
      />
    </>
  );
};

export default FeedEmbed;
