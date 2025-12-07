import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";

export const metadata = {
  title: "Alp Dinamik | Lineer Hareket Sistemleri",
  description: "Lineer hareket sistemleri konusunda projeci ve mühendislik odaklı hizmet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/favicon.ico" />
      </head>
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
