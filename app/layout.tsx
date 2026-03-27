import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import SiteChrome from "@/components/SiteChrome";

const lato = localFont({
  variable: "--font-lato",
  src: [
    { path: "../public/font/Lato/Lato-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/font/Lato/Lato-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../public/font/Lato/Lato-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/font/Lato/Lato-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/font/Lato/Lato-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/font/Lato/Lato-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../public/font/Lato/Lato-Black.ttf", weight: "900", style: "normal" },
    { path: "../public/font/Lato/Lato-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NavaHub Cambodia | Save the Children",
  description:
    "NavaHub Cambodia connects young people, communities, and partners to co-create practical digital solutions for children across Cambodia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <I18nProvider>
          <SiteChrome>{children}</SiteChrome>
        </I18nProvider>
      </body>
    </html>
  );
}
