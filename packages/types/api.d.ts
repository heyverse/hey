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

export type AppStatus = {
  email: string;
  requested: boolean;
  requestedAt: string;
};
