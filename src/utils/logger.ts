type LogArg = string | number | boolean | object | null | undefined;

interface Logger {
  debug: (message: string, ...args: LogArg[]) => void;
  info: (message: string, ...args: LogArg[]) => void;
  warn: (message: string, ...args: LogArg[]) => void;
  error: (message: string, ...args: LogArg[]) => void;
}

const isProduction: boolean = import.meta.env.PROD;

/**
 * Typed application logger.
 *
 * In production builds all methods are no-ops so the app keeps no `console.*`
 * calls in shipped code. In development it forwards to the matching console
 * method. This is the single sanctioned place where `console` is used.
 */
export const logger: Logger = {
  debug: (message, ...args) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.debug(message, ...args);
    }
  },
  info: (message, ...args) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.info(message, ...args);
    }
  },
  warn: (message, ...args) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.warn(message, ...args);
    }
  },
  error: (message, ...args) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.error(message, ...args);
    }
  },
};
