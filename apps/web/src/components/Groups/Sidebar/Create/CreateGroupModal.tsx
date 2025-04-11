import AvatarUpload from "@/components/Shared/AvatarUpload";
import {
  Button,
  Form,
  Input,
  TextArea,
  useZodForm
} from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import uploadMetadata from "@/helpers/uploadMetadata";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import { useCreateGroupMutation } from "@hey/indexer";
import { group } from "@lens-protocol/metadata";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateGroupStore } from "./CreateGroup";

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

const CreateGroupModal = () => {
  const { isSuspended } = useAccountStatus();
  const { setScreen, setTransactionHash } = useCreateGroupStore();
  const [pfpUrl, setPfpUrl] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const form = useZodForm({
    schema: ValidationSchema
  });

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    setTransactionHash(hash);
    setScreen("minting");
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [createGroup] = useCreateGroupMutation({
    onCompleted: async ({ createGroup }) => {
      if (createGroup.__typename === "CreateGroupResponse") {
        return onCompleted(createGroup.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: createGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleCreateGroup = async (data: z.infer<typeof ValidationSchema>) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    const metadataUri = await uploadMetadata(
      group({
        name: data.name,
        description: data.description || undefined,
        icon: pfpUrl
      })
    );

    return await createGroup({ variables: { request: { metadataUri } } });
  };

  return (
    <Form className="space-y-4 p-5" form={form} onSubmit={handleCreateGroup}>
      <Input label="Name" placeholder="Name" {...form.register("name")} />
      <TextArea
        label="Description"
        placeholder="Please provide additional details"
        {...form.register("description")}
      />
      <AvatarUpload
        src={pfpUrl || ""}
        setSrc={(src) => setPfpUrl(src)}
        isSmall
      />
      <Button
        className="flex w-full justify-center"
        disabled={isSubmitting}
        type="submit"
      >
        Create group
      </Button>
    </Form>
  );
};

export default CreateGroupModal;
