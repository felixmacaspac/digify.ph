import { Mulish } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/menu";
import Hero from "@/components/hero";

const mulish = Mulish({
  subsets: ["latin"],
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "digify.ph",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mulish.className} suppressHydrationWarning>
      <body>
        <main>
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
