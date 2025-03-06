import { ALLOWED_HTML_HOSTS } from "@hey/data/og";

// URLs that are manually picked to be embedded that dont have embed metatags
const pickUrlSites = ["open.spotify.com", "kick.com", "suno.com"];

// URLs that should not have query params removed
const skipClean = ["youtube.com", "youtu.be"];

const regexPatterns = {
  spotifyTrack:
    /^https?:\/\/open\.spotify\.com\/track\/[\dA-Za-z]+(\?si=[\dA-Za-z]+)?$/,
  spotifyPlaylist:
    /^https?:\/\/open\.spotify\.com\/playlist\/[\dA-Za-z]+(\?si=[\dA-Za-z]+)?$/,
  oohlala:
    /^https?:\/\/oohlala\.xyz\/playlist\/[\dA-Fa-f-]+(\?si=[\dA-Za-z]+)?$/,
  soundCloud:
    /^https?:\/\/soundcloud\.com(?:\/[\dA-Za-z-]+){2}(\?si=[\dA-Za-z]+)?$/,
  youtube:
    /^https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]+)(?:\?.*)?$/,
  tape: /^https?:\/\/tape\.xyz\/watch\/[\dA-Za-z-]+(\?si=[\dA-Za-z]+)?$/,
  twitch: /^https?:\/\/www\.twitch\.tv\/videos\/[\dA-Za-z-]+$/,
  kick: /^https?:\/\/kick\.com\/[\dA-Za-z-]+$/,
  suno: /^https?:\/\/suno\.com\/song\/[\dA-Fa-f-]+(\?si=[\dA-Za-z]+)?$/
};

// Define a type for the valid hostnames
type Hostname =
  | "youtube.com"
  | "tape.xyz"
  | "twitch.tv"
  | "kick.com"
  | "open.spotify.com"
  | "soundcloud.com"
  | "oohlala.xyz"
  | "suno.com";

const generateIframe = (
  embedUrl: null | string,
  url: string
): null | string => {
  const universalSize = `width="100%" height="415"`;
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace("www.", "");
  const pickedUrl = pickUrlSites.includes(hostname) ? url : embedUrl;
  const cleanedUrl = skipClean.includes(hostname)
    ? url
    : (pickedUrl?.split("?")[0] as string);

  if (!ALLOWED_HTML_HOSTS.includes(hostname) || !pickedUrl) {
    return null;
  }

  // Update the iframeGenerator type
  const iframeGenerator: Record<Hostname, () => string | null> & {
    default: () => string;
  } = {
    "youtube.com": () =>
      regexPatterns.youtube.test(cleanedUrl)
        ? `<iframe src="${pickedUrl}" ${universalSize} allow="accelerometer; encrypted-media" allowfullscreen></iframe>`
        : null,
    "tape.xyz": () =>
      regexPatterns.tape.test(cleanedUrl)
        ? `<iframe src="${pickedUrl}" ${universalSize} allow="accelerometer; encrypted-media" allowfullscreen></iframe>`
        : null,
    "twitch.tv": () => {
      const twitchEmbedUrl = pickedUrl.replace(
        "&player=facebook&autoplay=true&parent=meta.tag",
        "&player=hey&autoplay=false&parent=hey.xyz"
      );
      return regexPatterns.twitch.test(cleanedUrl)
        ? `<iframe src="${twitchEmbedUrl}" ${universalSize} allowfullscreen></iframe>`
        : null;
    },
    "kick.com": () => {
      const kickEmbedUrl = pickedUrl.replace("kick.com", "player.kick.com");
      return regexPatterns.kick.test(cleanedUrl)
        ? `<iframe src="${kickEmbedUrl}" ${universalSize} allowfullscreen></iframe>`
        : null;
    },
    "open.spotify.com": () => {
      const spotifySize = `style="max-width: 100%;" width="100%"`;
      if (regexPatterns.spotifyTrack.test(cleanedUrl)) {
        const spotifyUrl = pickedUrl.replace("/track", "/embed/track");
        return `<iframe src="${spotifyUrl}" ${spotifySize} height="155" allow="encrypted-media"></iframe>`;
      }
      if (regexPatterns.spotifyPlaylist.test(cleanedUrl)) {
        const spotifyUrl = pickedUrl.replace("/playlist", "/embed/playlist");
        return `<iframe src="${spotifyUrl}" ${spotifySize} height="380" allow="encrypted-media"></iframe>`;
      }
      return null;
    },
    "soundcloud.com": () =>
      regexPatterns.soundCloud.test(cleanedUrl)
        ? `<iframe src="${pickedUrl}" ${universalSize}></iframe>`
        : null,
    "oohlala.xyz": () =>
      regexPatterns.oohlala.test(cleanedUrl)
        ? `<iframe src="${pickedUrl}" ${universalSize}></iframe>`
        : null,
    "suno.com": () => {
      const sunoSize = `style="max-width: 100%;" width="100%"`;
      if (regexPatterns.suno.test(cleanedUrl)) {
        const sunoUrl = pickedUrl.replace("/song", "/embed");
        return `<iframe src="${sunoUrl}" ${sunoSize} height="155"></iframe>`;
      }
      return null;
    },
    default: () => `<iframe src="${pickedUrl}" width="560"></iframe>`
  };

  return (iframeGenerator[hostname as Hostname] || iframeGenerator.default)();
};

export default generateIframe;
