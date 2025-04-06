import { BRAND_COLOR, COVER, STATIC_IMAGES_URL } from "@hey/data/constants";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";

interface CoverProps {
  cover: string;
}

const Cover = ({ cover }: CoverProps) => {
  const isDefaultCover = cover.includes(STATIC_IMAGES_URL);
  const backgroundImage = isDefaultCover
    ? `${STATIC_IMAGES_URL}/patterns/2.svg`
    : imageKit(sanitizeDStorageUrl(cover), COVER);

  const backgroundStyles = {
    backgroundColor: BRAND_COLOR,
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: "center center",
    backgroundRepeat: isDefaultCover ? "repeat" : "no-repeat",
    backgroundSize: isDefaultCover ? "30%" : "cover"
  };

  return (
    <div className="mx-auto">
      <div className="h-52 sm:h-64 md:rounded-2xl" style={backgroundStyles} />
    </div>
  );
};

export default Cover;
