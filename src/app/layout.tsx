import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation/Navigation";

export const metadata: Metadata = {
  title: "Recipe Manager",
  description: "A recipe sharing app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

