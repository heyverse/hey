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

export default {
  debug,
  error,
  info,
  warn
};
