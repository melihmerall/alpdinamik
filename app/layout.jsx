"use client";
import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
    const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');

    useEffect(() => {
        // Dynamically import Bootstrap JavaScript
        import("bootstrap/dist/js/bootstrap.min.js");

        // Dynamically import WOW.js and initialize
        import("wowjs").then(({ WOW }) => {
            new WOW({ live: false }).init();
        });

        // Fetch site settings for favicon
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => {
                if (data.faviconUrl) {
                    setFaviconUrl(data.faviconUrl);
                }
            })
            .catch(err => console.error('Error fetching favicon:', err));
    }, []);

    useEffect(() => {
        // Update favicon dynamically
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
    }, [faviconUrl]);

    return (
        <html lang="tr">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Alp Dinamik | Lineer Hareket Sistemleri</title>
                <link rel="icon" type="image/x-icon" href={faviconUrl} />
                {/* Preconnect to Google Fonts for faster loading */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
