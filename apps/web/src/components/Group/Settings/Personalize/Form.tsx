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
import useUpdateGroupMetadata from "@/hooks/useUpdateGroupMetadata";
import { Regex } from "@hey/data/regex";
import type { GroupFragment } from "@hey/indexer";
import { useState } from "react";
import { z } from "zod";

const ValidationSchema = z.object({
  name: z
    .string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.username, {
      message: "Name must not contain spaces or special characters"
    }),
  description: z.string().max(260, {
    message: "Description should not exceed 260 characters"
  })
});

interface PersonalizeSettingsFormProps {
  group: GroupFragment;
}

const PersonalizeSettingsForm = ({ group }: PersonalizeSettingsFormProps) => {
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    group.metadata?.icon
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    group.metadata?.coverPicture
  );
  const { updateGroup, isSubmitting } = useUpdateGroupMetadata(group);

  const form = useZodForm({
    defaultValues: {
      name: group?.metadata?.name || "",
      description: group?.metadata?.description || ""
    },
    schema: ValidationSchema
  });

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
