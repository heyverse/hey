import type { Ref } from "react";
import { memo } from "react";
import type { default as H5AudioPlayer } from "react-h5-audio-player";
import AudioPlayer from "react-h5-audio-player";

interface PlayerProps {
  playerRef: Ref<H5AudioPlayer>;
  src: string;
}

const Player = ({ playerRef, src }: PlayerProps) => {
  return <AudioPlayer ref={playerRef} src={src} />;
};

export default memo(Player);
