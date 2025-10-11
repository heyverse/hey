import { ERRORS } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import { type GroupFragment, useSetGroupMetadataMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { group as groupMetadata } from "@lens-protocol/metadata";
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
import logEvent from "@/helpers/logEvent";
import uploadMetadata from "@/helpers/uploadMetadata";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const ValidationSchema = z.object({
  description: z.string().max(260, {
    message: "Description should not exceed 260 characters"
  }),
  name: z
    .string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.username, {
      message: "Name must not contain spaces or special characters"
    })
});

interface PersonalizeSettingsFormProps {
  group: GroupFragment;
}

const PersonalizeSettingsForm = ({ group }: PersonalizeSettingsFormProps) => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    group.metadata?.icon
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    group.metadata?.coverPicture
  );
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = () => {
    setIsSubmitting(false);
    toast.success("Group updated");
    void logEvent("Update Group Settings");
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [setGroupMetadata] = useSetGroupMetadataMutation({
    onCompleted: async ({ setGroupMetadata }) => {
      if (setGroupMetadata.__typename === "SetGroupMetadataResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: setGroupMetadata
      });
    },
    onError
  });

  const form = useZodForm({
    defaultValues: {
      description: group?.metadata?.description || "",
      name: group?.metadata?.name || ""
    },
    schema: ValidationSchema
  });

  const updateGroup = async (
    data: z.infer<typeof ValidationSchema>,
    avatarUrl: string | undefined,
    coverUrl: string | undefined
  ) => {
    if (!currentAccount) {
      return toast.error(ERRORS.SignWallet);
    }

    setIsSubmitting(true);

    const metadataUri = await uploadMetadata(
      groupMetadata({
        coverPicture: coverUrl || undefined,
        description: data.description,
        icon: avatarUrl || undefined,
        name: data.name
      })
    );

    return await setGroupMetadata({
      variables: { request: { group: group.address, metadataUri } }
    });
  };

  const onSetAvatar = async (src: string | undefined) => {
    setAvatarUrl(src);
    return await updateGroup({ ...form.getValues() }, src, coverUrl);
  };

  const onSetCover = async (src: string | undefined) => {
    setCoverUrl(src);
    return await updateGroup({ ...form.getValues() }, avatarUrl, src);
  };

  return (
    <Card>
      <CardHeader
        icon={<BackButton path={`/g/${group.address}/settings`} />}
        title="Personalize"
      />
      <Form
        className="space-y-4 p-5"
        form={form}
        onSubmit={(data) => updateGroup(data, avatarUrl, coverUrl)}
      >
        <Input
          disabled
          label="Group Address"
          type="text"
          value={group.address}
        />
        <Input
          label="Name"
          placeholder="Milady"
          type="text"
          {...form.register("name")}
        />
        <TextArea
          label="Description"
          placeholder="Tell us something about your group!"
          {...form.register("description")}
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
