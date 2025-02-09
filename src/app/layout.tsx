import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kutufix Kutu Öneri Sistemi",
  description: "Kutufix, kutu öneri sisteminiz.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon-01.png" type="image/png" />
      </head>
      <body>
        <header className="header">
          <h1 className="site-title">Kutufix Kutu Öneri Sistemi</h1>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} Kutufix - Tüm Hakları Saklıdır.</p>
        </footer>
      </body>
    </html>
  );
}
