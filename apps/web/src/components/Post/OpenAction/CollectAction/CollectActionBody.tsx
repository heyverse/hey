import CountdownTimer from "@/components/Shared/CountdownTimer";
import PostExecutors from "@/components/Shared/Modal/PostExecutors";
import Slug from "@/components/Shared/Slug";
import {
  H3,
  H4,
  HelpTooltip,
  Modal,
  Tooltip,
  WarningMessage
} from "@/components/Shared/UI";
import formatDate from "@/helpers/datetime/formatDate";
import getTokenImage from "@/helpers/getTokenImage";
import humanize from "@/helpers/humanize";
import nFormatter from "@/helpers/nFormatter";
import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import { BLOCK_EXPLORER_URL } from "@hey/data/constants";
import formatAddress from "@hey/helpers/formatAddress";
import getAccount from "@hey/helpers/getAccount";
import type {
  AnyPostFragment,
  PostFragment,
  SimpleCollectActionFragment
} from "@hey/indexer";
import plur from "plur";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router";
import CollectActionButton from "./CollectActionButton";
import Splits from "./Splits";

interface CollectActionBodyProps {
  targetPost: AnyPostFragment;
  collectAction: SimpleCollectActionFragment;
  collects: number;
  collectLimit: number;
  percentageCollected: number;
  currency?: string;
  amount: number;
  recipients: any[];
  isTokenEnabled: boolean;
  isSaleEnded: boolean;
  isAllCollected: boolean;
  endTimestamp?: string | null;
  setShowCollectModal: Dispatch<SetStateAction<boolean>>;
  showCollectorsModal: boolean;
  setShowCollectorsModal: Dispatch<SetStateAction<boolean>>;
  increment: () => void;
}

const CollectActionBody = ({
  targetPost,
  collectAction,
  collects,
  collectLimit,
  percentageCollected,
  currency,
  amount,
  recipients,
  isTokenEnabled,
  isSaleEnded,
  isAllCollected,
  endTimestamp,
  setShowCollectModal,
  showCollectorsModal,
  setShowCollectorsModal,
  increment
}: CollectActionBodyProps) => (
  <>
    {collectLimit ? (
      <Tooltip
        content={`${percentageCollected.toFixed(0)}% Collected`}
        placement="top"
      >
        <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2.5 bg-black dark:bg-white"
            style={{ width: `${percentageCollected}%` }}
          />
        </div>
      </Tooltip>
    ) : null}
    <div className="p-5">
      {isAllCollected ? (
        <WarningMessage
          className="mb-5"
          message={
            <div className="flex items-center space-x-1.5">
              <CheckCircleIcon className="size-4" />
              <span>This collection has been sold out</span>
            </div>
          }
        />
      ) : isSaleEnded ? (
        <WarningMessage
          className="mb-5"
          message={
            <div className="flex items-center space-x-1.5">
              <ClockIcon className="size-4" />
              <span>This collection has ended</span>
            </div>
          }
        />
      ) : null}
      <div className="mb-4">
        <H4>
          {targetPost.__typename} by{" "}
          <Slug slug={getAccount(targetPost.author).usernameWithPrefix} />
        </H4>
      </div>
      {amount ? (
        <div className="flex items-center space-x-1.5 py-2">
          {isTokenEnabled ? (
            <img
              alt={currency}
              className="size-7 rounded-full"
              height={28}
              src={getTokenImage(currency)}
              title={currency}
              width={28}
            />
          ) : (
            <CurrencyDollarIcon className="size-7" />
          )}
          <span className="space-x-1">
            <H3 as="span">{amount}</H3>
            <span className="text-xs">{currency}</span>
          </span>
          <div className="mt-2">
            <HelpTooltip>
              <div className="py-1">
                <div className="flex items-start justify-between space-x-10">
                  <div>Hey</div>
                  <b>
                    ~{(amount * 0.025).toFixed(2)} {currency} (2.5%)
                  </b>
                </div>
              </div>
            </HelpTooltip>
          </div>
        </div>
      ) : null}
      <div className="space-y-1.5">
        <div className="block items-center space-y-1 sm:flex sm:space-x-5">
          <div className="flex items-center space-x-2">
            <UsersIcon className="size-4 text-gray-500 dark:text-gray-200" />
            <button
              className="font-bold"
              onClick={() => setShowCollectorsModal(true)}
              type="button"
            >
              {humanize(collects)} {plur("collector", collects)}
            </button>
          </div>
          {collectLimit && !isAllCollected ? (
            <div className="flex items-center space-x-2">
              <PhotoIcon className="size-4 text-gray-500 dark:text-gray-200" />
              <div className="font-bold">
                {collectLimit - collects} available
              </div>
            </div>
          ) : null}
        </div>
        {endTimestamp && !isAllCollected ? (
          <div className="flex items-center space-x-2">
            <ClockIcon className="size-4 text-gray-500 dark:text-gray-200" />
            <div className="space-x-1.5">
              <span>{isSaleEnded ? "Sale ended on:" : "Sale ends:"}</span>
              <span className="font-bold text-gray-600">
                {isSaleEnded ? (
                  `${formatDate(endTimestamp, "MMM D, YYYY, hh:mm A")}`
                ) : (
                  <CountdownTimer targetDate={endTimestamp} />
                )}
              </span>
            </div>
          </div>
        ) : null}
        {collectAction.address ? (
          <div className="flex items-center space-x-2">
            <PuzzlePieceIcon className="size-4 text-gray-500 dark:text-gray-200" />
            <div className="space-x-1.5">
              <span>Token:</span>
              <Link
                className="font-bold text-gray-600"
                to={`${BLOCK_EXPLORER_URL}/address/${collectAction.address}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                {formatAddress(collectAction.address)}
              </Link>
            </div>
          </div>
        ) : null}
        {amount ? (
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="size-4 text-gray-500 dark:text-gray-200" />
            <div className="space-x-1.5">
              <span>Revenue:</span>
              <Tooltip
                content={`${humanize(amount * collects)} ${currency}`}
                placement="top"
              >
                <span className="font-bold text-gray-600">
                  {nFormatter(amount * collects)} {currency}
                </span>
              </Tooltip>
            </div>
          </div>
        ) : null}
        {recipients.length > 1 ? <Splits recipients={recipients} /> : null}
      </div>
      <div className="flex items-center space-x-2">
        <CollectActionButton
          collects={collects}
          onCollectSuccess={() => {
            increment();
            setShowCollectModal(false);
          }}
          postAction={collectAction}
          post={targetPost as PostFragment}
        />
      </div>
    </div>
    <Modal
      onClose={() => setShowCollectorsModal(false)}
      show={showCollectorsModal}
      title="Collectors"
    >
      <PostExecutors postId={targetPost.id} filter={{ simpleCollect: true }} />
    </Modal>
  </>
);

export default CollectActionBody;
