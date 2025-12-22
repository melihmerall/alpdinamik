"use client";
import { useEffect, useState } from "react";
import { LoadingProvider } from "@/lib/loading-context";
import { AppProvider, useAppContext } from "@/lib/app-context";
import PageLoaderV2 from "@/components/common/page-loader-v2";
import CookieConsent from "@/components/layout/cookie-consent";
import "./globals.css";

function LayoutContent({ children }) {
    const { siteSettings } = useAppContext();

    useEffect(() => {
        // Update favicon dynamically when siteSettings loads
        if (siteSettings?.faviconUrl) {
            const existingLink = document.querySelector("link[rel*='icon']");
            if (existingLink) {
                existingLink.href = siteSettings.faviconUrl;
            } else {
                const link = document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = siteSettings.faviconUrl;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        }
    }, [siteSettings]);

    return <>{children}</>;
}

export default function RootLayout({ children }) {

    useEffect(() => {
        // Dynamically import Bootstrap JavaScript
        import("bootstrap/dist/js/bootstrap.min.js");

        // Dynamically import WOW.js and initialize
        import("wowjs")
            .then(({ WOW }) => {
                // Initialize WOW.js with mobile support and immediate animation
                const wow = new WOW({ 
                    live: false,
                    mobile: true,
                    boxClass: 'wow',
                    animateClass: 'animated',
                    offset: 0,
                    scrollContainer: null
                });
                wow.init();
                
                // Force show all elements on initial load
                setTimeout(() => {
                    const wowElements = document.querySelectorAll('.wow');
                    wowElements.forEach((el) => {
                        if (!el.classList.contains('animated')) {
                            el.style.visibility = 'visible';
                            el.style.opacity = '1';
                        }
                    });
                }, 100);
            })
            .catch(() => {
                // If WOW.js fails, ensure all elements are visible
                const wowElements = document.querySelectorAll('.wow');
                wowElements.forEach((el) => {
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                });
            });
    }, []);

    return (
        <html lang="tr">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Alpdinamik | Lineer Hareket Sistemleri</title>
                {/* Preconnect to Google Fonts for faster loading */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* DNS Prefetch for external resources */}
                <link rel="dns-prefetch" href="https://html.nextwpcook.com" />
                {/* CSS Files - Load immediately in head for first render */}
                <link rel="stylesheet" href="/assets/css/fontawesome.css" />
                <link rel="stylesheet" href="/assets/font/flaticon_flexitype.css" />
                <link rel="stylesheet" href="/assets/css/animate.css" />
                <link rel="stylesheet" href="/assets/css/meanmenu.min.css" />
                <link rel="stylesheet" href="/assets/sass/style.css" />
            </head>
            <body className="wow-pre-init">
                <AppProvider>
                    <LayoutContent>
                        <LoadingProvider>
                            <PageLoaderV2 />
                            {children}
                            <CookieConsent />
                        </LoadingProvider>
                    </LayoutContent>
                </AppProvider>
            </body>
        </html>
    );
}
