import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Whisper",
  description: "A chat app built with Convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
