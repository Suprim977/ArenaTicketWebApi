import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata: Metadata = {
  title: "ArenaTicket",
  description: "ArenaTicket esports booking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
