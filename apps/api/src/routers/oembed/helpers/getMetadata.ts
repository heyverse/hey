import getFavicon from "@hey/helpers/getFavicon";
import axios from "axios";
import { parseHTML } from "linkedom";
import { HEY_USER_AGENT } from "../../../helpers/constants";
import generateIframe from "./meta/generateIframe";
import getDescription from "./meta/getDescription";
import getEmbedUrl from "./meta/getEmbedUrl";
import getImage from "./meta/getImage";
import getSite from "./meta/getSite";
import getTitle from "./meta/getTitle";

const fetchData = async (url: string) => {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": HEY_USER_AGENT }
  });
  return data;
};

const extractMetadata = (document: Document, url: string) => {
  return {
    description: getDescription(document),
    favicon: getFavicon(url),
    html: generateIframe(getEmbedUrl(document), url),
    image: getImage(document),
    site: getSite(document),
    title: getTitle(document),
    url
  };
};

const getMetadata = async (url: string) => {
  try {
    const data = await fetchData(url);
    const { document } = parseHTML(data);
    return extractMetadata(document, url);
  } catch {
    return null;
  }
};

export default getMetadata;
