"use client";
import { useState, useEffect } from 'react';
import SEO from "@/components/data/seo";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "../common/breadcrumb";
import AboutMain from "./about";
import Video from "./video";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";

const AboutUs = () => {
    const [siteSettings, setSiteSettings] = useState(null);
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsRes, aboutRes] = await Promise.all([
                    fetch('/api/site-settings'),
                    fetch('/api/company-pages/hakkimizda')
                ]);
                
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setSiteSettings(data);
                }

                if (aboutRes.ok) {
                    const data = await aboutRes.json();
                    setAboutData(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const breadcrumbBgImage = aboutData?.breadcrumbImageUrl
        ? aboutData.breadcrumbImageUrl
        : aboutData?.imageUrl
        ? aboutData.imageUrl
        : siteSettings?.defaultBreadcrumbImageUrl
        ? siteSettings.defaultBreadcrumbImageUrl
        : '/assets/img/breadcrumb.jpg';

    const pageTitle = aboutData?.title || "Hakkımızda";

    return (
        <>
            <SEO pageTitle={pageTitle} />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb 
                title={pageTitle} 
                innerTitle={pageTitle}
                backgroundImage={breadcrumbBgImage}
            />
            <AboutMain aboutData={aboutData} />
            {aboutData?.videoUrl && (
                <Video 
                    videoUrl={aboutData.videoUrl} 
                    videoBackgroundImageUrl={aboutData.videoBackgroundImageUrl}
                />
            )}
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default AboutUs;