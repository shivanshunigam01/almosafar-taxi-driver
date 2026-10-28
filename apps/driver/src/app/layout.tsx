import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";
import { DemoNotice } from "@/components/DemoNotice";

export const metadata: Metadata = {
  title: "Almosafar Driver",
  description: "Mobile-first driver demo (Baghdad · IQD)",
  applicationName: "Almosafar Driver",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
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
