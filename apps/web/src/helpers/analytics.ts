const trackEvent = (event: string, data?: Record<string, any>) => {
  return (window as any)?.sa_event(event, data);
};

export default trackEvent;
