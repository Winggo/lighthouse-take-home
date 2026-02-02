import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O-1 Visa Case Builder",
  description: "Build your O-1 visa case strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
