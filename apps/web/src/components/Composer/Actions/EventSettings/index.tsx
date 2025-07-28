import { CalendarIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@/components/Shared/UI";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { usePostEventStore } from "@/store/non-persisted/post/usePostEventStore";

const EventSettings = () => {
  const { attachments } = usePostAttachmentStore();
  const { resetEventPost, setShowEventEditor, showEventEditor } =
    usePostEventStore();
  const disable = attachments.length > 0;

  return (
    <Tooltip content="Create Event" placement="top" withDelay>
      <button
        aria-label="Create Event"
        className="rounded-full outline-offset-8"
        disabled={disable}
        onClick={() => {
          resetEventPost();
          setShowEventEditor(!showEventEditor);
        }}
        type="button"
      >
        <CalendarIcon className="size-5" />
      </button>
    </Tooltip>
  );
};

export default EventSettings;
