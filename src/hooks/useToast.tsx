'use client';

import { useCallback, useEffect, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface UseToastResult {
  toast: (input: ToastInput) => void;
  ToastContainer: () => JSX.Element;
}

export function useToast(): UseToastResult {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((input: ToastInput) => {
    const id = window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);

    setToasts((current) => [
      ...current,
      {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant || 'info',
      },
    ]);
  }, []);

  useEffect(() => {
    return () => {
      toasts.forEach((item) => window.clearTimeout(item.id));
    };
  }, [toasts]);

  function ToastContainer() {
    return (
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
        {toasts.map((item) => {
          const palette =
            item.variant === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-100'
              : item.variant === 'error'
                ? 'border-red-200 bg-red-50 text-red-800 shadow-red-100'
                : 'border-indigo-200 bg-indigo-50 text-indigo-800 shadow-indigo-100';

          return (
            <div key={item.id} className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg ${palette}`}>
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description ? <p className="mt-1 text-sm leading-5 opacity-90">{item.description}</p> : null}
            </div>
          );
        })}
      </div>
    );
  }

  return { toast, ToastContainer };
}