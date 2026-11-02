import type { Metadata } from "next";
import { StoreProvider } from "@/components/StoreProvider";
import { Header, Footer } from "@/components/Shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "MATE ELECTRICALS | Powering Every Space",
    template: "%s | MATE ELECTRICALS",
  },
  description:
    "Explore lighting, fans, switches, wiring and electrical essentials with Mate Electricals in Hingna, Nagpur. A complete demonstration storefront.",
  icons: { icon: "/brand/favicon.svg", apple: "/brand/monogram.svg" },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id="top">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <StoreProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
