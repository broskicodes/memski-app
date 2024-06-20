import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/magicui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/magicui/site-header";
import { SiteFooter } from "@/components/magicui/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memski",
  description: "An AI that remembers you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <main className="mx-auto flex-1 overflow-hidden">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
