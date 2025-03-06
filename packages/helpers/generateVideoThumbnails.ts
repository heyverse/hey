/**
 * Retrieves a thumbnail from a video file at a specified time.
 *
 * @param {File} file - The video file from which the thumbnail is generated.
 * @param {number} currentTime - The time in seconds at which the thumbnail is generated.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded string representing the thumbnail.
 */
const canvasImageFromVideo = (
  file: File,
  currentTime: number
): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      video.currentTime = currentTime;
    };
    video.oncanplay = () => {
      setTimeout(() => {
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        return resolve(canvas.toDataURL("image/png"));
      }, 100);
    };
  });
};

/**
 * Retrieves an array of video thumbnails from a given video file.
 *
 * @param {File} file - The video file from which thumbnails are generated.
 * @param {number} count - The number of thumbnails to generate.
 * @returns {Promise<string[]>} A promise that resolves to an array of base64 encoded strings representing the thumbnails.
 */
export const generateVideoThumbnails = (
  file: File,
  count: number
): Promise<string[]> => {
  return new Promise((resolve) => {
    try {
      if (!file.size) {
        return [];
      }
      // creating video element to get duration
      const video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
      video.onloadeddata = async () => {
        const thumbnailArray: string[] = [];
        const averageSplitTime = Math.floor(video.duration / count);
        for (let i = 0; i < count; i++) {
          const currentTime = averageSplitTime * i;
          const thumbnail = await canvasImageFromVideo(file, currentTime);
          thumbnailArray.push(thumbnail);
        }
        resolve(thumbnailArray);
      };
    } catch {
      resolve([]);
    }
  });
};
