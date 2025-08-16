const convertToTitleCase = (input: string): string => {
  if (input.includes("_")) {
    const words = input.toLowerCase().split("_");
    const titleCasedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return titleCasedWords.join(" ");
  }

  const withSpaces = input.replace(/([A-Z])/g, " $1").trim();
  const words = withSpaces.split(" ");
  const titleCasedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return titleCasedWords.join(" ");
};

export default convertToTitleCase;
