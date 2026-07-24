const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  (() => {
    try {
      return new URL(apiUrl).origin;
    } catch {
      return "http://localhost:5000";
    }
  })();

export const getProfileImageUrl = (imagePath?: string | null, cacheKey?: string): string | null => {
  if (!imagePath) return null;
  const url = /^https?:\/\//i.test(imagePath)
    ? imagePath
    : `${BACKEND_ORIGIN}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  return cacheKey ? `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(cacheKey)}` : url;
};
