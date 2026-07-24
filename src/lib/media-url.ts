const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8089/api/v1";

export const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  (() => {
    try {
      return new URL(apiUrl).origin;
    } catch {
      return "http://localhost:8089";
    }
  })();

export const normalizeMediaPath = (path?: string | null): string | null => {
  if (!path) return null;
  if (/^(?:https?:|blob:|data:)/i.test(path)) return path;
  const normalized = path.replace(/\\/g, "/").replace(/^\/?src\/uploads\//i, "/uploads/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export const getMediaUrl = (path?: string | null, cacheKey?: string): string | null => {
  const normalized = normalizeMediaPath(path);
  if (!normalized) return null;
  const url = /^(?:https?:|blob:|data:)/i.test(normalized)
    ? normalized
    : `${BACKEND_ORIGIN}${normalized}`;
  return cacheKey ? `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(cacheKey)}` : url;
};
