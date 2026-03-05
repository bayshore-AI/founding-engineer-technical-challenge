interface Logger {
  error: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  debug: (message: string, data?: Record<string, unknown>) => void;
}

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;

function getLevel(): number {
  const env = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug");
  return LOG_LEVELS[env as keyof typeof LOG_LEVELS] ?? LOG_LEVELS.info;
}

export function logger(module: string): Logger {
  const level = getLevel();
  const prefix = `[${module}]`;

  return {
    error: (message, data) => {
      if (level >= LOG_LEVELS.error) console.error(prefix, message, data ?? "");
    },
    warn: (message, data) => {
      if (level >= LOG_LEVELS.warn) console.warn(prefix, message, data ?? "");
    },
    info: (message, data) => {
      if (level >= LOG_LEVELS.info) console.log(prefix, message, data ?? ""); // eslint-disable-line no-console
    },
    debug: (message, data) => {
      if (level >= LOG_LEVELS.debug) console.log(prefix, message, data ?? ""); // eslint-disable-line no-console
    },
  };
}

export function errorDetails(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV !== "production" && error.stack ? { stack: error.stack } : {}),
    };
  }
  return { error: String(error) };
}
