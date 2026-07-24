export const formatMoney = (value?: number | null): string =>
  `Rs ${(value ?? 0).toLocaleString("en-NP")}`;

export const formatDate = (value?: string | Date | null): string => {
  if (!value) return "Date TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBA";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatLongDate = (value?: string | Date | null): string => {
  if (!value) return "Date TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBA";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatTime = (value?: string | Date | null): string => {
  if (!value) return "Time TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value : "Time TBA";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return `${formatDate(date)} · ${formatTime(date)}`;
};

export const fullName = (
  person?: { firstName?: string; lastName?: string } | null,
): string => [person?.firstName, person?.lastName].filter(Boolean).join(" ");
