"use client";
import { useState, useEffect, useMemo } from 'react';
import SEO from "@/components/data/seo";
import FooterTwo from "../../layout/footers/footer-two";
import HeaderFour from "../../layout/headers/header-four";
import BreadCrumb from "../common/breadcrumb";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import ContactMain from "./contact";

const ContactUs = () => {
    const [siteSettings, setSiteSettings] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchSettings() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/site-settings`);
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        setSiteSettings(data);
                    }
                }
            } catch (error) {
                // Error fetching site settings
            }
        }
        fetchSettings();
        return () => {
            isMounted = false;
        };
    }, []);

    // Default map for İstanbul, Türkiye (Alp Dinamik)
    const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.424314489!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76ed36d4b1c5a1!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2str!4v1234567890123!5m2!1sen!2str";
    
    // Memoize map URL calculation to prevent unnecessary re-renders
    const mapUrl = useMemo(() => {
        let rawMapUrl = siteSettings?.mapEmbedUrl || '';
        if (rawMapUrl && rawMapUrl.includes('<iframe')) {
            const srcMatch = rawMapUrl.match(/src=["']([^"']+)["']/);
            if (srcMatch) {
                rawMapUrl = srcMatch[1];
            }
        }
        return rawMapUrl || defaultMapUrl;
    }, [siteSettings?.mapEmbedUrl, defaultMapUrl]);
    
    const mapTitle = useMemo(() => {
        return siteSettings?.address || "Alp Dinamik - İstanbul, Türkiye";
    }, [siteSettings?.address]);

    return (
        <>
            <SEO pageTitle="İletişim" />
            <HeaderFour />
            <CustomCursor />
            <SwitchTab />
            <BreadCrumb title="İletişim" innerTitle="İletişim" />
            <ContactMain siteSettings={siteSettings} />
            <div className="map section-padding pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12 wow fadeInUp" data-wow-delay=".4s">
                            <div className="map-area">
                                <iframe 
                                    src={mapUrl} 
                                    loading="lazy" 
                                    title={mapTitle}
                                    aria-label={mapTitle}
                                    style={{ width: '100%', height: '450px', border: 0 }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterTwo />
        </>
    );
};

export default ContactUs;