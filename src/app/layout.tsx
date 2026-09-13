import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Team Manager",
  title: "Team Manager",
  description:
    "Client-side team management workspace with Redux Toolkit and mock player data.",
  openGraph: {
    title: "Team Manager",
    description:
      "Client-side team management workspace with Redux Toolkit and mock player data.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
