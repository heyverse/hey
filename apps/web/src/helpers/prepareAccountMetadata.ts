import trimify from "@hey/helpers/trimify";
import type {
  AccountOptions,
  MetadataAttribute
} from "@lens-protocol/metadata";
import { MetadataAttributeType } from "@lens-protocol/metadata";

type ExistingAttribute = {
  key: string;
  type: string;
  value: string;
};

type ExistingMetadata = {
  name?: string | null;
  bio?: string | null;
  picture?: string | null;
  coverPicture?: string | null;
  attributes?: ExistingAttribute[] | null;
};

type HasMetadata = {
  metadata?: ExistingMetadata | null;
};

interface PrepareAccountMetadataInput {
  attributes: Record<string, string | undefined>;
  name?: string;
  bio?: string;
  picture?: string | undefined;
  coverPicture?: string | undefined;
}

const prepareAccountMetadata = (
  current: HasMetadata,
  input: PrepareAccountMetadataInput
): AccountOptions => {
  const { name, bio, picture, coverPicture, attributes: attrs } = input;

  const prevAttrs: MetadataAttribute[] =
    current.metadata?.attributes?.map(({ key, type, value }) => ({
      key,
      type: (MetadataAttributeType as any)[type],
      value
    })) ?? [];

  const newAttrs: MetadataAttribute[] = Object.entries(attrs)
    .filter(([, v]) => v !== undefined)
    .map(([key, value]) => ({
      key,
      type: MetadataAttributeType.STRING,
      value: value as string
    }));

  const finalName = name || current.metadata?.name || undefined;
  const finalBio = bio || current.metadata?.bio || undefined;

  const mergedByKey = new Map<string, MetadataAttribute>(
    [...prevAttrs, ...newAttrs].map((a) => [a.key, a])
  );
  const mergedAttrs = Array.from(mergedByKey.values());

  const prepared: AccountOptions = {
    ...(finalName ? { name: finalName } : {}),
    ...(finalBio ? { bio: finalBio } : {}),
    attributes: mergedAttrs.filter(
      (a) => a.key !== "" && Boolean(trimify(a.value))
    ),
    coverPicture: coverPicture ?? current.metadata?.coverPicture ?? undefined,
    picture: picture ?? current.metadata?.picture ?? undefined
  };

  return prepared;
};

export default prepareAccountMetadata;
