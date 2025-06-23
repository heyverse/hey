import type { MarkupLinkProps } from "@hey/types/misc";
import { Link } from "react-router";
import injectReferrerToUrl from "@/helpers/injectReferrerToUrl";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import truncateUrl from "@/helpers/truncateUrl";

const ExternalLink = ({ title }: MarkupLinkProps) => {
  let href = title;

  if (!href) {
    return null;
  }

  if (!href.includes("://")) {
    href = `https://${href}`;
  }

  const url = injectReferrerToUrl(href);

  return (
    <Link
      onClick={stopEventPropagation}
      rel="noopener"
      target={url.includes(location.host) ? "_self" : "_blank"}
      to={url}
    >
      {title ? truncateUrl(title, 30) : title}
    </Link>
  );
};

export default ExternalLink;
