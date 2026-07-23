export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  ok?: boolean;
  success?: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}
