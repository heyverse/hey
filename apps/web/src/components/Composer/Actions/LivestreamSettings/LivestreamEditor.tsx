import Video from "@/components/Shared/Post/Video";
import { Card, Spinner, Tooltip } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { hono } from "@/helpers/fetcher";
import { usePostLiveStore } from "@/store/non-persisted/post/usePostLiveStore";
import {
  ClipboardDocumentIcon,
  SignalIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { getSrc } from "@livepeer/react/external";
import { useMutation } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <Card
      className="flex justify-center p-3 font-bold hover:bg-gray-50 dark:hover:bg-gray-900"
      forceRounded
    >
      <div className="flex items-center space-x-2">{children}</div>
    </Card>
  );
};

const LivestreamEditor = () => {
  const {
    liveVideoConfig,
    resetLiveVideoConfig,
    setLiveVideoConfig,
    setShowLiveVideoEditor
  } = usePostLiveStore();

  const [screen, setScreen] = useState<"create" | "record">("create");
  const { mutate, isPending } = useMutation({
    mutationFn: ({ record }: { record: boolean }) =>
      hono.live.create({ record }),
    onSuccess: (data) => {
      setLiveVideoConfig(data);
    },
    onError: errorToast
  });

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <VideoCameraIcon className="size-4" />
          <b>Go Live</b>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip content="Delete" placement="top">
            <button
              className="flex"
              onClick={() => {
                resetLiveVideoConfig();
                setShowLiveVideoEditor(false);
              }}
              type="button"
            >
              <XCircleIcon className="size-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {isPending ? (
          <Wrapper>
            <Spinner size="xs" />
            <div>Creating Live Stream...</div>
          </Wrapper>
        ) : liveVideoConfig.playbackId.length > 0 ? (
          <>
            <Card className="space-y-2 p-3" forceRounded>
              <div className="flex items-center space-x-1">
                <b>Stream URL:</b>
                <div className="">rtmp://rtmp.hey.xyz/live</div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      "rtmp://rtmp.hey.xyz/live"
                    );
                    toast.success("Copied to clipboard!");
                  }}
                  type="button"
                >
                  <ClipboardDocumentIcon className="size-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <b>Stream Key:</b>
                <div className="">{liveVideoConfig.streamKey}</div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      liveVideoConfig.streamKey
                    );
                    toast.success("Copied to clipboard!");
                  }}
                  type="button"
                >
                  <ClipboardDocumentIcon className="size-4 text-gray-400" />
                </button>
              </div>
            </Card>
            <Video
              src={getSrc(
                `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`
              )}
            />
          </>
        ) : screen === "create" ? (
          <button
            className="w-full"
            onClick={() => setScreen("record")}
            type="button"
          >
            <Wrapper>
              <SignalIcon className="size-5" />
              <div>Create Live Stream</div>
            </Wrapper>
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              className="w-full"
              onClick={() => mutate({ record: true })}
              type="button"
            >
              <Wrapper>
                <VideoCameraIcon className="size-5" />
                <div>Record</div>
              </Wrapper>
            </button>
            <button
              className="w-full"
              onClick={() => mutate({ record: false })}
              type="button"
            >
              <Wrapper>
                <VideoCameraSlashIcon className="size-5" />
                <div>Don't Record</div>
              </Wrapper>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LivestreamEditor;
