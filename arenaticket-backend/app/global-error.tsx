"use client";
// Top-level boundary — replaces the root layout when the app crashes,
// so it must render its own html/body and import global styles.
import "./globals.css";

export default function GlobalError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    return (
        <html lang="en">
            <body className="flex min-h-screen items-center justify-center bg-canvas text-body">
                <div className="flex flex-col items-center px-6 text-center">
                    <span className="m-stripe mb-6 h-1 w-16 rounded-full" />
                    <h2 className="text-xl font-bold text-on-dark">Something went wrong</h2>
                    <p className="mt-2 max-w-sm text-sm text-muted">
                        {error.message || "A critical error occurred. Please try again."}
                    </p>
                    <button
                        onClick={() => unstable_retry()}
                        className="mt-6 flex h-10 items-center bg-on-dark px-4 text-xs font-bold uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
