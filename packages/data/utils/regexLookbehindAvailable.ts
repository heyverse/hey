const regexLookbehindAvailable: boolean = ((): boolean => {
  try {
    return "ab".replace(/(?<=a)b/g, "c") === "ac";
  } catch {
    return false;
  }
})();

export default regexLookbehindAvailable;
