import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";
import { DemoNotice } from "@/components/DemoNotice";

export const metadata: Metadata = {
  title: "Almosafar Taxi — Passenger",
  description: "Mobile-first passenger demo (Baghdad · IQD)",
  applicationName: "Almosafar Passenger",
  appleWebApp: { capable: true, title: "Almosafar Passenger" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <AppProviders>
          <DemoNotice />
          <main className="mx-auto min-h-dvh w-full max-w-lg safe-bottom">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
