import { ERRORS } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import trimify from "@hey/helpers/trimify";
import { useMeLazyQuery, useSetAccountMetadataMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import type {
  AccountOptions,
  MetadataAttribute
} from "@lens-protocol/metadata";
import {
  account as accountMetadata,
  MetadataAttributeType
} from "@lens-protocol/metadata";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import AvatarUpload from "@/components/Shared/AvatarUpload";
import BackButton from "@/components/Shared/BackButton";
import CoverUpload from "@/components/Shared/CoverUpload";
import {
  Button,
  Card,
  CardHeader,
  Form,
  Input,
  TextArea,
  useZodForm
} from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import getAccountAttribute from "@/helpers/getAccountAttribute";
import logEvent from "@/helpers/logEvent";
import uploadMetadata from "@/helpers/uploadMetadata";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const ValidationSchema = z.object({
  bio: z.string().max(260, { message: "Bio should not exceed 260 characters" }),
  location: z.string().max(100, {
    message: "Location should not exceed 100 characters"
  }),
  name: z
    .string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.accountNameValidator, {
      message: "Account name must not contain restricted symbols"
    }),
  website: z.union([
    z.string().regex(Regex.url, { message: "Invalid website" }),
    z.string().max(0)
  ]),
  x: z.string().max(100, { message: "X handle must not exceed 100 characters" })
});

const PersonalizeSettingsForm = () => {
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    currentAccount?.metadata?.picture
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    currentAccount?.metadata?.coverPicture
  );
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();
  const [getCurrentAccountDetails] = useMeLazyQuery({
    fetchPolicy: "no-cache"
  });

  const onCompleted = async (hash: string) => {
    await waitForTransactionToComplete(hash);
    const accountData = await getCurrentAccountDetails();
    setCurrentAccount(accountData?.data?.me.loggedInAs.account);
    setIsSubmitting(false);
    toast.success("Account updated");
    void logEvent("Update Account Settings");
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [setAccountMetadata] = useSetAccountMetadataMutation({
    onCompleted: async ({ setAccountMetadata }) => {
      if (setAccountMetadata.__typename === "SetAccountMetadataResponse") {
        return onCompleted(setAccountMetadata.hash);
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: setAccountMetadata
      });
    },
    onError
  });

  const form = useZodForm({
    defaultValues: {
      bio: currentAccount?.metadata?.bio || "",
      location: getAccountAttribute(
        "location",
        currentAccount?.metadata?.attributes
      ),
      name: currentAccount?.metadata?.name || "",
      website: getAccountAttribute(
        "website",
        currentAccount?.metadata?.attributes
      ),
      x: getAccountAttribute(
        "x",
        currentAccount?.metadata?.attributes
      )?.replace(/(https:\/\/)?x\.com\//, "")
    },
    schema: ValidationSchema
  });

  const updateAccount = async (
    data: z.infer<typeof ValidationSchema>,
    avatarUrl: string | undefined,
    coverUrl: string | undefined
  ) => {
    if (!currentAccount) {
      return toast.error(ERRORS.SignWallet);
    }

    setIsSubmitting(true);
    const otherAttributes =
      currentAccount.metadata?.attributes
        ?.filter(
          (attr) =>
            !["app", "location", "timestamp", "website", "x"].includes(attr.key)
        )
        .map(({ key, type, value }) => ({
          key,
          type: MetadataAttributeType[type] as any,
          value
        })) || [];

    const preparedAccountMetadata: AccountOptions = {
      ...(data.name && { name: data.name }),
      ...(data.bio && { bio: data.bio }),
      attributes: [
        ...(otherAttributes as MetadataAttribute[]),
        {
          key: "location",
          type: MetadataAttributeType.STRING,
          value: data.location
        },
        {
          key: "website",
          type: MetadataAttributeType.STRING,
          value: data.website
        },
        { key: "x", type: MetadataAttributeType.STRING, value: data.x },
        {
          key: "timestamp",
          type: MetadataAttributeType.STRING,
          value: new Date().toISOString()
        }
      ],
      coverPicture: coverUrl || undefined,
      picture: avatarUrl || undefined
    };
    preparedAccountMetadata.attributes =
      preparedAccountMetadata.attributes?.filter((m) => {
        return m.key !== "" && Boolean(trimify(m.value));
      });
    const metadataUri = await uploadMetadata(
      accountMetadata(preparedAccountMetadata)
    );

    return await setAccountMetadata({
      variables: { request: { metadataUri } }
    });
  };

  const onSetAvatar = async (src: string | undefined) => {
    setAvatarUrl(src);
    return await updateAccount({ ...form.getValues() }, src, coverUrl);
  };

  const onSetCover = async (src: string | undefined) => {
    setCoverUrl(src);
    return await updateAccount({ ...form.getValues() }, avatarUrl, src);
  };

  return (
    <Card>
      <CardHeader icon={<BackButton path="/settings" />} title="Personalize" />
      <Form
        className="space-y-4 p-5"
        form={form}
        onSubmit={(data) => updateAccount(data, avatarUrl, coverUrl)}
      >
        <Input
          disabled
          label="Account Address"
          type="text"
          value={currentAccount?.address}
        />
        <Input
          label="Name"
          placeholder="Gavin"
          type="text"
          {...form.register("name")}
        />
        <Input
          label="Location"
          placeholder="Miami"
          type="text"
          {...form.register("location")}
        />
        <Input
          label="Website"
          placeholder="https://hooli.com"
          type="text"
          {...form.register("website")}
        />
        <Input
          label="X"
          placeholder="gavin"
          prefix="https://x.com"
          type="text"
          {...form.register("x")}
        />
        <TextArea
          label="Bio"
          placeholder="Tell us something about you!"
          {...form.register("bio")}
        />
        <AvatarUpload setSrc={onSetAvatar} src={avatarUrl || ""} />
        <CoverUpload setSrc={onSetCover} src={coverUrl || ""} />
        <Button
          className="ml-auto"
          disabled={
            isSubmitting || (!form.formState.isDirty && !coverUrl && !avatarUrl)
          }
          loading={isSubmitting}
          type="submit"
        >
          Save
        </Button>
      </Form>
    </Card>
  );
};

export default PersonalizeSettingsForm;
