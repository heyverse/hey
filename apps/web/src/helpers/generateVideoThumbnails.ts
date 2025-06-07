const generateVideoThumbnails = async (
  file: File,
  count: number
): Promise<string[]> => {
  if (!file.size) {
    return [];
  }

  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  const canvas = document.createElement("canvas");
  video.muted = true;
  video.src = url;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        resolve();
      };
      video.onerror = () => reject();
    });

    let queue: Promise<void> = Promise.resolve();
    const seekAndCapture = (time: number): Promise<string> => {
      const result = queue.then(
        () =>
          new Promise<string>((resolve) => {
            const handleSeeked = () => {
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
              resolve(canvas.toDataURL("image/png"));
            };
            video.addEventListener("seeked", handleSeeked, { once: true });
            video.currentTime = time;
          })
      );
      queue = result.then(() => undefined);
      return result;
    };

    const step = video.duration / count;
    return await Promise.all(
      Array.from({ length: count }).map((_, i) => seekAndCapture(step * i))
    );
  } catch {
    return [];
  } finally {
    video.remove();
    canvas.remove();
    URL.revokeObjectURL(url);
  }
};

export default generateVideoThumbnails;
