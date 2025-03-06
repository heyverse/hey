const getUserLocale = () => {
  const locale = navigator?.languages?.length
    ? navigator.languages[0]
    : navigator.language;

  return locale ? locale.split("-")[0] : "en";
};

export default getUserLocale;
