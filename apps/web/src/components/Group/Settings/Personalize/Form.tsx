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
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import { type GroupFragment, useSetGroupMetadataMutation } from "@hey/indexer";
import { group as groupMetadata } from "@lens-protocol/metadata";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const ValidationSchema = z.object({
  name: z
    .string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.accountNameValidator, {
      message: "Account name must not contain restricted symbols"
    }),
  description: z.string().max(260, {
    message: "Description should not exceed 260 characters"
  })
});

interface PersonalizeSettingsFormProps {
  group: GroupFragment;
}

const PersonalizeSettingsForm = ({ group }: PersonalizeSettingsFormProps) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    group.metadata?.icon
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    group.metadata?.coverPicture
  );
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = () => {
    setIsSubmitting(false);
    toast.success("Group updated");
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [setGroupMetadata] = useSetGroupMetadataMutation({
    onCompleted: async ({ setGroupMetadata }) => {
      if (setGroupMetadata.__typename === "SetGroupMetadataResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: setGroupMetadata,
        onCompleted,
        onError
      });
    },
    onError
  });

  const form = useZodForm({
    defaultValues: {
      name: group?.metadata?.name || "",
      description: group?.metadata?.description || ""
    },
    schema: ValidationSchema
  });

  const updateGroup = async (
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

    const metadataUri = await uploadMetadata(
      groupMetadata({
        name: data.name,
        description: data.description,
        icon: pfpUrl || undefined,
        coverPicture: coverUrl || undefined
      })
    );

    return await setGroupMetadata({
      variables: { request: { group: group.address, metadataUri } }
    });
  };

  const onSetAvatar = async (src: string | undefined) => {
    setPfpUrl(src);
    return await updateGroup({ ...form.getValues() }, src, coverUrl);
  };

  const onSetCover = async (src: string | undefined) => {
    setCoverUrl(src);
    return await updateGroup({ ...form.getValues() }, pfpUrl, src);
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
        onSubmit={(data) => updateGroup(data, pfpUrl, coverUrl)}
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
        <AvatarUpload src={pfpUrl || ""} setSrc={onSetAvatar} />
        <CoverUpload src={coverUrl || ""} setSrc={onSetCover} />
        <Button
          className="ml-auto"
          disabled={
            isSubmitting || (!form.formState.isDirty && !coverUrl && !pfpUrl)
          }
          type="submit"
        >
          Save
        </Button>
      </Form>
    </Card>
  );
};

export default PersonalizeSettingsForm;
