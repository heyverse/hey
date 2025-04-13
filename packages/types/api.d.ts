export type Account = {
  isSuspended: boolean;
};

export type Preferences = {
  appIcon: number;
  includeLowScore: boolean;
  permissions: string[];
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
