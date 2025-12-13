"use client";
import { useState, useEffect } from 'react';
import SEO from "@/components/data/seo";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "../common/breadcrumb";
import CompanyHistory from "./history";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";

const History = () => {
    const [siteSettings, setSiteSettings] = useState(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/site-settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSiteSettings(data);
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
            }
        }
        fetchSettings();
    }, []);

    const breadcrumbBgImage = siteSettings?.defaultBreadcrumbImageUrl
        ? siteSettings.defaultBreadcrumbImageUrl
        : '/assets/img/breadcrumb.jpg';

    return (
        <>
            <SEO pageTitle="Tarihçemiz" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb 
                title="Tarihçemiz" 
                innerTitle="Tarihçemiz"
                backgroundImage={breadcrumbBgImage}
            />
            <CompanyHistory />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default History;