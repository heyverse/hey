export type URI = string;

export enum SmartMediaStatus {
  ACTIVE = "active", // handler updated it
  FAILED = "failed", // handler failed to update it
  DISABLED = "disabled" // updates are disabled
}

export type Template = {
  id: string;
  formatted: string;
};

export type Category = {
  id: string;
  formatted: string;
};

export interface SmartMediaLight {
  template: Template;
  category: Category;
  mediaUrl?: string;
  isCanvas?: boolean;
}

export interface SmartMedia extends SmartMediaLight {
  agentId: string; // uuid
  creator: `0x${string}`; // lens account
  createdAt: number; // unix ts
  updatedAt: number; // unix ts
  templateData?: unknown; // specific data needed per template
  postId: string; // lens post id; will be null for previews
  maxStaleTime: number; // seconds
  uri: URI; // lens storage node uri
  token: {
    chain: "base" | "lens";
    address: `0x${string}`;
  };
  protocolFeeRecipient: `0x${string}`; // media template
  description?: string;
  isProcessing?: boolean;
  versions?: string[];
  status?: SmartMediaStatus;
  estimatedCost?: number; // estimated credits per generation
  featured?: boolean; // whether the post should be featured
}
