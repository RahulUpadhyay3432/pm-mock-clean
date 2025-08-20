import type { Metadata } from "next";
import "./globals.css";
import ClientBoot from "@/components/ClientBoot"; // if this import fails, see note below

export const metadata: Metadata = {
  title: "PM Mock",
  description: "Mock PM interviews with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Boots once on the client to set anonId in localStorage + cookie */}
        <ClientBoot />
        {children}
      </body>
    </html>
  );
}
