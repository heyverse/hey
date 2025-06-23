import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { usePostLiveStore } from "@/store/non-persisted/post/usePostLiveStore";

const LivestreamSettings = () => {
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePostLiveStore();
  const { attachments } = usePostAttachmentStore();
  const disable = attachments.length > 0;

  return (
    <Tooltip content="Go Live" placement="top" withDelay>
      <button
        aria-label="Go Live"
        className={cn("rounded-full outline-offset-8", {
          "opacity-50": disable
        })}
        disabled={disable}
        onClick={() => {
          resetLiveVideoConfig();
          setShowLiveVideoEditor(!showLiveVideoEditor);
        }}
        type="button"
      >
        <VideoCameraIcon className="size-5" />
      </button>
    </Tooltip>
  );
};

export default LivestreamSettings;
