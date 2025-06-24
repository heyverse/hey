import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import type { default as H5AudioPlayer } from "react-h5-audio-player";
import { z } from "zod";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { usePostAudioStore } from "@/store/non-persisted/post/usePostAudioStore";
import CoverImage from "./CoverImage";
import Player from "./Player";

export const AudioPostSchema = z.object({
  artist: z.string().trim().min(1, { message: "Invalid artist name" }),
  cover: z.string().trim().min(1, { message: "Invalid cover image" }),
  title: z.string().trim().min(1, { message: "Invalid audio title" })
});

interface AudioProps {
  artist?: string;
  isNew?: boolean;
  poster: string;
  src: string;
  title?: string;
}

const Audio = ({ artist, isNew = false, poster, src, title }: AudioProps) => {
  const { audioPost, setAudioPost } = usePostAudioStore();
  const [newPreviewUri, setNewPreviewUri] = useState<null | string>(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<H5AudioPlayer>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handlePlayPause = () => {
    const audio = playerRef.current?.audio.current;

    if (!audio) {
      return;
    }

    if (audio.paused && !playing) {
      setPlaying(true);
      audio.play();
    } else {
      setPlaying(false);
      audio.pause();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAudioPost({
      ...audioPost,
      [event.target.name]: event.target.value
    });
  };

  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-gray-500 p-0 dark:border-gray-700"
      onClick={stopEventPropagation}
      style={{ backgroundImage: `url(${isNew ? newPreviewUri : poster})` }}
    >
      <div className="flex flex-wrap p-5 backdrop-blur-2xl backdrop-brightness-50 md:flex-nowrap md:space-x-2 md:p-0">
        <CoverImage
          cover={isNew ? (newPreviewUri as string) : poster}
          imageRef={imageRef}
          isNew={isNew}
          setCover={(previewUri, cover, mimeType) => {
            setNewPreviewUri(previewUri);
            setAudioPost({ ...audioPost, cover, mimeType });
          }}
        />
        <div className="flex w-full flex-col justify-between truncate py-1 md:px-2">
          <div className="mt-3 flex justify-between md:mt-7">
            <div className="flex w-full items-center space-x-2.5 truncate">
              <button onClick={handlePlayPause} type="button">
                {playing && !playerRef.current?.audio.current?.paused ? (
                  <PauseIcon className="size-12 text-gray-100 hover:text-white" />
                ) : (
                  <PlayIcon className="size-12 text-gray-100 hover:text-white" />
                )}
              </button>
              <div className="w-full truncate pr-3">
                {isNew ? (
                  <div className="flex w-full flex-col space-y-1">
                    <input
                      autoComplete="off"
                      className="border-none bg-transparent p-0 text-lg text-white placeholder:text-white focus:ring-0"
                      name="title"
                      onChange={handleChange}
                      placeholder="Add title"
                      value={audioPost.title}
                    />
                    <input
                      autoComplete="off"
                      className="border-none bg-transparent p-0 text-white/70 placeholder:text-white/70 focus:ring-0"
                      name="artist"
                      onChange={handleChange}
                      placeholder="Add artist"
                      value={audioPost.artist}
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="truncate text-lg text-white">{title}</h5>
                    <h6 className="truncate text-white/70">{artist}</h6>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="md:pb-3">
            <Player playerRef={playerRef} src={src} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
