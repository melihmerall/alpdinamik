"use client";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
    useEffect(() => {
        // Dynamically import Bootstrap JavaScript
        import("bootstrap/dist/js/bootstrap.min.js");

        // Dynamically import WOW.js and initialize
        import("wowjs").then(({ WOW }) => {
            new WOW({ live: false }).init();
        });
    }, []);

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>My Application</title>
                <link rel="icon" type="image/png" href="/favicon.ico" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
