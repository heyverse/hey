import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { STATIC_IMAGES_URL, TRANSFORMS } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type { AccountFragment } from "@hey/indexer";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import FollowUnfollowButton from "@/components/Shared/Account/FollowUnfollowButton";
import TipButton from "@/components/Shared/Account/TipButton";
import Markup from "@/components/Shared/Markup";
import Slug from "@/components/Shared/Slug";
import { Button, H3, Image, LightBox, Tooltip } from "@/components/Shared/UI";
import getAccountAttribute from "@/helpers/getAccountAttribute";
import getFavicon from "@/helpers/getFavicon";
import getMentions from "@/helpers/getMentions";
import { useTheme } from "@/hooks/useTheme";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Followerings from "./Followerings";
import FollowersYouKnowOverview from "./FollowersYouKnowOverview";
import AccountMenu from "./Menu";
import MetaDetails from "./MetaDetails";

interface DetailsProps {
  isBlockedByMe: boolean;
  hasBlockedMe: boolean;
  account: AccountFragment;
}

const Details = ({
  isBlockedByMe = false,
  hasBlockedMe = false,
  account
}: DetailsProps) => {
  const navigate = useNavigate();
  const { currentAccount } = useAccountStore();
  const { setShow: setShowProModal } = useProModalStore();
  const [showLightBox, setShowLightBox] = useState<boolean>(false);
  const { theme } = useTheme();

  const handleShowLightBox = useCallback(() => {
    setShowLightBox(true);
  }, []);

  const handleCloseLightBox = useCallback(() => {
    setShowLightBox(false);
  }, []);

  const renderAccountAttribute = (
    attribute: "location" | "website" | "x",
    icon: ReactNode
  ) => {
    if (isBlockedByMe || hasBlockedMe) return null;

    const value = getAccountAttribute(attribute, account?.metadata?.attributes);
    if (!value) return null;

    return (
      <MetaDetails icon={icon}>
        <Link
          rel="noreferrer noopener"
          target="_blank"
          to={
            attribute === "website"
              ? `https://${value.replace(/https?:\/\//, "")}`
              : `https://x.com/${value.replace("https://x.com/", "")}`
          }
        >
          {value.replace(/https?:\/\//, "")}
        </Link>
      </MetaDetails>
    );
  };

  return (
    <div className="mb-4 space-y-3 px-5 md:px-0">
      <div className="flex items-start justify-between">
        <div className="-mt-14 sm:-mt-24 relative ml-5 size-20 sm:size-36">
          <Image
            alt={account.address}
            className="size-20 cursor-pointer rounded-full bg-gray-200 ring-3 ring-gray-50 sm:size-36 dark:bg-gray-700 dark:ring-black"
            height={128}
            onClick={handleShowLightBox}
            src={getAvatar(account, TRANSFORMS.AVATAR_BIG)}
            width={128}
          />
          <LightBox
            images={[getAvatar(account, TRANSFORMS.EXPANDED_AVATAR)]}
            onClose={handleCloseLightBox}
            show={showLightBox}
          />
        </div>
        <div className="flex items-center gap-x-2">
          {currentAccount?.address === account.address ? (
            <Button onClick={() => navigate("/settings")} outline>
              Edit Account
            </Button>
          ) : isBlockedByMe || hasBlockedMe ? null : (
            <FollowUnfollowButton account={account} />
          )}
          {!isBlockedByMe && !hasBlockedMe && <TipButton account={account} />}
          <AccountMenu account={account} />
        </div>
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5">
          <H3 className="truncate">{getAccount(account).name}</H3>
          {account.hasSubscribed ? (
            <Tooltip content="Verified" placement="right">
              <CheckBadgeIcon className="size-5 text-brand-500" />
            </Tooltip>
          ) : currentAccount?.address === account.address ? (
            <button
              className="ml-1 flex items-center gap-x-1 rounded-full border border-gray-200 px-2 py-0.5 font-semibold text-xs dark:border-gray-700"
              onClick={() => setShowProModal(true)}
              type="button"
            >
              <CheckBadgeIcon className="size-4 text-brand-500" />
              Get Verified
            </button>
          ) : null}
        </div>
        <div className="flex items-center space-x-3">
          <Slug
            className="text-sm sm:text-base"
            slug={getAccount(account).usernameWithPrefix}
          />
          {account.operations?.isFollowingMe ? (
            <div className="rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
              Follows you
            </div>
          ) : null}
        </div>
      </div>
      {!isBlockedByMe && !hasBlockedMe && account?.metadata?.bio ? (
        <div className="markup linkify">
          <Markup mentions={getMentions(account?.metadata.bio)}>
            {account?.metadata.bio}
          </Markup>
        </div>
      ) : null}
      <div className="space-y-5">
        <Followerings account={account} />
        {!isBlockedByMe &&
        !hasBlockedMe &&
        currentAccount?.address !== account.address ? (
          <FollowersYouKnowOverview
            address={account.address}
            username={getAccount(account).username}
          />
        ) : null}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {!isBlockedByMe &&
            !hasBlockedMe &&
            getAccountAttribute("location", account?.metadata?.attributes) && (
              <MetaDetails icon={<MapPinIcon className="size-4" />}>
                {getAccountAttribute("location", account?.metadata?.attributes)}
              </MetaDetails>
            )}
          {renderAccountAttribute(
            "website",
            <img
              alt="Website"
              className="size-4 rounded-full"
              height={16}
              src={getFavicon(
                getAccountAttribute("website", account?.metadata?.attributes)
              )}
              width={16}
            />
          )}
          {renderAccountAttribute(
            "x",
            <Image
              alt="X Logo"
              className="size-4"
              height={16}
              src={`${STATIC_IMAGES_URL}/brands/${theme === "dark" ? "x-dark.png" : "x-light.png"}`}
              width={16}
            />
          )}
          <MetaDetails icon={<CalendarIcon className="size-4" />}>
            Joined {dayjs(account.createdAt).format("MMM YYYY")}
          </MetaDetails>
        </div>
      </div>
    </div>
  );
};

export default Details;
