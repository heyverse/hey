/**
 * Retrieves the user's locale for metadata.
 *
 * @returns {string} - The user's locale or 'en-US' as default.
 */
const getUserLocale = () => {
  const locale = navigator?.languages?.length
    ? navigator.languages[0]
    : navigator.language;

  return locale ? locale.split("-")[0] : "en";
};

export default getUserLocale;
