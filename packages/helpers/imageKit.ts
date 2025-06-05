import { LENS_MEDIA_SNAPSHOT_URL } from "@hey/data/constants";

const imageKit = (url: string, name?: string): string => {
  if (!url) {
    return "";
  }

  if (url.includes(LENS_MEDIA_SNAPSHOT_URL)) {
    const splitUrl = url.split("/");
    const path = splitUrl[splitUrl.length - 1];

    return name ? `${LENS_MEDIA_SNAPSHOT_URL}/${name}/${path}` : url;
  }

  return url;
};

export default imageKit;
