import axios from "axios";
import { parseHTML } from "linkedom";
import { HEY_USER_AGENT } from "../../../helpers/constants";
import getDescription from "./meta/getDescription";
import getTitle from "./meta/getTitle";

const fetchData = async (url: string) => {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": HEY_USER_AGENT }
  });
  return data;
};

const extractMetadata = (document: Document, url: string) => {
  return {
    title: getTitle(document),
    description: getDescription(document),
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
