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
import uploadMetadata from "@/helpers/uploadMetadata";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import getAccountAttribute from "@hey/helpers/getAccountAttribute";
import trimify from "@hey/helpers/trimify";
import { useMeLazyQuery, useSetAccountMetadataMutation } from "@hey/indexer";
import type {
  AccountOptions,
  MetadataAttribute
} from "@lens-protocol/metadata";
import {
  MetadataAttributeType,
  account as accountMetadata
} from "@lens-protocol/metadata";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

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
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    currentAccount?.metadata?.picture
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    currentAccount?.metadata?.coverPicture
  );
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();
  const [getCurrentAccountDetails] = useMeLazyQuery({
    fetchPolicy: "no-cache"
  });

  const onCompleted = (hash: string) => {
    pollTransactionStatus(hash, async () => {
      const accountData = await getCurrentAccountDetails();
      setCurrentAccount(accountData?.data?.me.loggedInAs.account);
      setIsSubmitting(false);
      toast.success("Account updated");
    });
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [setAccountMetadata] = useSetAccountMetadataMutation({
    onCompleted: async ({ setAccountMetadata }) => {
      if (setAccountMetadata.__typename === "SetAccountMetadataResponse") {
        return onCompleted(setAccountMetadata.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: setAccountMetadata,
        onCompleted,
        onError
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
    pfpUrl: string | undefined,
    coverUrl: string | undefined
  ) => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
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
      picture: pfpUrl || undefined
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
    setPfpUrl(src);
    return await updateAccount({ ...form.getValues() }, src, coverUrl);
  };

  const onSetCover = async (src: string | undefined) => {
    setCoverUrl(src);
    return await updateAccount({ ...form.getValues() }, pfpUrl, src);
  };

  return (
    <Card>
      <CardHeader icon={<BackButton path="/settings" />} title="Personalize" />
      <Form
        className="space-y-4 p-5"
        form={form}
        onSubmit={(data) => updateAccount(data, pfpUrl, coverUrl)}
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
        <AvatarUpload src={pfpUrl || ""} setSrc={onSetAvatar} />
        <CoverUpload src={coverUrl || ""} setSrc={onSetCover} />
        <Button
          className="ml-auto"
          disabled={
            isSubmitting || (!form.formState.isDirty && !coverUrl && !pfpUrl)
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
