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
