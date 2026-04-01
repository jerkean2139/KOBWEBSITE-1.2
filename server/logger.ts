type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  requestId?: string;
  userId?: string;
  endpoint?: string;
  duration?: number;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, context, error } = entry;
  const levelStr = level.toUpperCase().padEnd(5);
  
  let output = `[${timestamp}] ${levelStr} ${message}`;
  
  if (context && Object.keys(context).length > 0) {
    const contextStr = Object.entries(context)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
      .join(" ");
    if (contextStr) {
      output += ` | ${contextStr}`;
    }
  }
  
  if (error) {
    output += ` | error="${error.message}"`;
    if (error.code) {
      output += ` code=${error.code}`;
    }
  }
  
  return output;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    error: error
      ? {
          message: error.message,
          stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
          code: (error as any).code,
        }
      : undefined,
  };
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (!shouldLog("debug")) return;
    const entry = createLogEntry("debug", message, context);
    console.log(formatLogEntry(entry));
  },

  info(message: string, context?: LogContext): void {
    if (!shouldLog("info")) return;
    const entry = createLogEntry("info", message, context);
    console.log(formatLogEntry(entry));
  },

  warn(message: string, context?: LogContext, error?: Error): void {
    if (!shouldLog("warn")) return;
    const entry = createLogEntry("warn", message, context, error);
    console.warn(formatLogEntry(entry));
    if (error?.stack && process.env.NODE_ENV !== "production") {
      console.warn(error.stack);
    }
  },

  error(message: string, context?: LogContext, error?: Error): void {
    if (!shouldLog("error")) return;
    const entry = createLogEntry("error", message, context, error);
    console.error(formatLogEntry(entry));
    if (error?.stack) {
      console.error(error.stack);
    }
  },

  request(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    if (!shouldLog(level)) return;
    
    const entry = createLogEntry(level, `${method} ${path} ${statusCode}`, {
      ...context,
      duration: Math.round(duration),
    });
    
    if (level === "error") {
      console.error(formatLogEntry(entry));
    } else if (level === "warn") {
      console.warn(formatLogEntry(entry));
    } else {
      console.log(formatLogEntry(entry));
    }
  },

  ai(
    operation: string,
    provider: string,
    success: boolean,
    duration: number,
    context?: LogContext
  ): void {
    const level = success ? "info" : "error";
    if (!shouldLog(level)) return;
    
    const entry = createLogEntry(
      level,
      `AI ${operation} via ${provider} ${success ? "succeeded" : "failed"}`,
      { ...context, duration: Math.round(duration) }
    );
    
    if (level === "error") {
      console.error(formatLogEntry(entry));
    } else {
      console.log(formatLogEntry(entry));
    }
  },

  security(event: string, context?: LogContext): void {
    const entry = createLogEntry("warn", `SECURITY: ${event}`, context);
    console.warn(formatLogEntry(entry));
  },
};

export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function withRequestLogging(
  req: any,
  res: any,
  next: () => void
): void {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  req.requestId = requestId;
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.request(req.method, req.path, res.statusCode, duration, {
      requestId,
      userId: req.userId,
    });
  });
  
  next();
}
