/**
 * Tracks an event with Simple Analytics.
 *
 * @param {string} event - The event to track.
 * @param {Record<string, any>} [data] - Optional data to track.
 * @returns {any} The result of the Simple Analytics event.
 */
const trackEvent = (event: string, data?: Record<string, any>) => {
  return (window as any)?.sa_event(event, data);
};

export default trackEvent;
