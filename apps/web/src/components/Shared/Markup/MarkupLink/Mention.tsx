import AccountPreview from "@/components/Shared/Account/AccountPreview";
import Slug from "@/components/Shared/Slug";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import { Link } from "react-router";

const Mention = ({ mentions, title }: MarkupLinkProps) => {
  const username = title;

  if (!username) {
    return null;
  }

  const fullUsernames = mentions?.map((mention) => mention.replace.from);

  if (!fullUsernames?.includes(username)) {
    return title;
  }

  const canShowUserPreview = (username: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === username
    );

    return Boolean(foundMention?.replace);
  };

  const getNameFromMention = (username: string): string => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === username
    );

    return foundMention?.replace.from.split("/")[1] || "";
  };

  const getAddressFromMention = (username: string): string => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === username
    );

    return foundMention?.__typename === "AccountMention"
      ? foundMention.account
      : "";
  };

  if (canShowUserPreview(username)) {
    return (
      <Link
        className="outline-none focus:underline"
        to={`/u/${getNameFromMention(username)}`}
        onClick={stopEventPropagation}
      >
        <AccountPreview
          username={getNameFromMention(username)}
          address={getAddressFromMention(username)}
        >
          <Slug prefix="@" slug={getNameFromMention(username)} useBrandColor />
        </AccountPreview>
      </Link>
    );
  }

  return <Slug prefix="@" slug={getNameFromMention(username)} useBrandColor />;
};

export default Mention;
