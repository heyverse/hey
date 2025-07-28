import { CalendarIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import {
  Button,
  Card,
  Form,
  Input,
  TextArea,
  Tooltip,
  useZodForm
} from "@/components/Shared/UI";
import { usePostEventStore } from "@/store/non-persisted/post/usePostEventStore";

const ValidationSchema = z.object({
  content: z.string().optional(),
  endsAt: z.string().min(1, { message: "End time is required" }),
  location: z.string().optional(),
  startsAt: z.string().min(1, { message: "Start time is required" }),
  title: z.string().min(1, { message: "Title is required" })
});

const EventEditor = () => {
  const { eventPost, setEventPost, resetEventPost, setShowEventEditor } =
    usePostEventStore();

  const form = useZodForm({
    defaultValues: eventPost,
    mode: "onChange",
    schema: ValidationSchema
  });

  const onSubmit = (data: z.infer<typeof ValidationSchema>) => {
    setEventPost({ ...eventPost, ...data });
    setShowEventEditor(false);
  };

  return (
    <Card className="m-5 space-y-3 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <CalendarIcon className="size-4" />
          <b>Create Event</b>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip content="Delete" placement="top">
            <button
              className="flex"
              onClick={() => {
                resetEventPost();
                setShowEventEditor(false);
              }}
              type="button"
            >
              <XCircleIcon className="size-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <Form className="space-y-3" form={form} onSubmit={onSubmit}>
        <Input label="Title" {...form.register("title")} />
        <TextArea label="Description" rows={3} {...form.register("content")} />
        <Input label="Location" {...form.register("location")} />
        <Input
          label="Starts At"
          type="datetime-local"
          {...form.register("startsAt")}
        />
        <Input
          label="Ends At"
          type="datetime-local"
          {...form.register("endsAt")}
        />
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            onClick={() => {
              setShowEventEditor(false);
            }}
            outline
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </Form>
    </Card>
  );
};

export default EventEditor;
