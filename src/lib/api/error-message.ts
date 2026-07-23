import axios from "axios";

const collectMessages = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.message === "string") return [record.message];
    return Object.values(record).flatMap(collectMessages);
  }
  return [];
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && !/AxiosError|MongoServerError|ZodError/.test(error.message)
      ? error.message
      : fallback;
  }
  if (!error.response) {
    return "Cannot reach the ArenaTicket server. Please check your connection and try again.";
  }
  const data: unknown = error.response.data;
  if (data && typeof data === "object") {
    const body = data as Record<string, unknown>;
    if (typeof body.message === "string") return body.message;
    const messages = collectMessages(body.errors ?? body.error);
    if (messages.length) return messages.join(" ");
  }
  return fallback;
};
