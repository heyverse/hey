import { Regex } from "@hey/data/regex";
import { useCreateGroupMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { group } from "@lens-protocol/metadata";
import { useState } from "react";
import { z } from "zod";
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
import { useCreateGroupStore } from "./CreateGroup";

const ValidationSchema = z.object({
  description: z.string().max(260, {
    message: "Description should not exceed 260 characters"
  }),
  name: z
    .string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.accountNameValidator, {
      message: "Account name must not contain restricted symbols"
    })
});

const CreateGroupModal = () => {
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

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [createGroup] = useCreateGroupMutation({
    onCompleted: async ({ createGroup }) => {
      if (createGroup.__typename === "CreateGroupResponse") {
        return onCompleted(createGroup.hash);
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: createGroup
      });
    },
    onError
  });

  const handleCreateGroup = async (data: z.infer<typeof ValidationSchema>) => {
    setIsSubmitting(true);

    const metadataUri = await uploadMetadata(
      group({
        description: data.description || undefined,
        icon: pfpUrl,
        name: data.name
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
        isSmall
        setSrc={(src) => setPfpUrl(src)}
        src={pfpUrl || ""}
      />
      <Button
        className="flex w-full justify-center"
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        Create group
      </Button>
    </Form>
  );
};

export default CreateGroupModal;
