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
import getAccountAttribute from "@/helpers/getAccountAttribute";
import useUpdateAccountMetadata from "@/hooks/useUpdateAccountMetadata";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Regex } from "@hey/data/regex";
import { useState } from "react";
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
  const { currentAccount } = useAccountStore();
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    currentAccount?.metadata?.picture
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    currentAccount?.metadata?.coverPicture
  );
  const { updateAccount, isSubmitting } = useUpdateAccountMetadata();

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
