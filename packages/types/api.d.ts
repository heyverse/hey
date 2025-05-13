export type Preferences = {
  appIcon: number;
  includeLowScore: boolean;
};

export type Oembed = {
  title: string;
  description: string;
  url: string;
};

export type STS = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

export type Live = {
  id: string;
  playbackId: string;
  streamKey: string;
};
