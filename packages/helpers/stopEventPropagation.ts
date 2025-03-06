/**
 * Stop event propagation.
 *
 * @param {object} event The event object from an event listener.
 * @returns {undefined}
 */
const stopEventPropagation = (event: any) => event.stopPropagation();

export default stopEventPropagation;
