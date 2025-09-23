const info = (...args: unknown[]): void => {
  console.info(...args);
};

const warn = (...args: unknown[]): void => {
  console.warn(...args);
};

const error = (...args: unknown[]): void => {
  console.error(...args);
};

const debug = (...args: unknown[]): void => {
  if (process.env.NODE_ENV !== "production") {
    console.debug(...args);
  }
};

export const withPrefix = (prefix: string) => {
  return {
    debug: (...args: unknown[]) => debug(prefix, ...args),
    error: (...args: unknown[]) => error(prefix, ...args),
    info: (...args: unknown[]) => info(prefix, ...args),
    warn: (...args: unknown[]) => warn(prefix, ...args)
  };
};

export default {
  debug,
  error,
  info,
  warn
};
