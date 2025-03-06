/**
 * Retrieves the given data into a JSON file and triggers a download.
 *
 * @param data - The data to be converted into JSON format and downloaded.
 * @param fileName - The name of the file to be downloaded (without extension).
 * @param callback - An optional callback function to be executed after the download is triggered.
 */
const downloadJson = (data: any, fileName: string, callback?: any) => {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(data)], { type: "application/json" });
  element.href = URL.createObjectURL(file);
  element.download = `${fileName}.json`;
  document.body.appendChild(element);
  element.click();
  callback?.();
};

export default downloadJson;
