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

export type AiTranslate = {
  text: string;
};

export type InitUpload = {
  uploadId: string;
  key: string;
};

export type UploadPart = {
  etag: string;
};

export type CompleteUpload = {
  uri: string;
};
