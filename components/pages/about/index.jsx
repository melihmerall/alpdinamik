"use client";
import { useState, useEffect } from 'react';
import SEO from "@/components/data/seo";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";
import BreadCrumb from "../common/breadcrumb";
import AboutMain from "./about";
import Video from "./video";
import Certification from "./certification";
import Team from "./team";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";

const AboutUs = () => {
    const [siteSettings, setSiteSettings] = useState(null);
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsRes, aboutRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/site-settings`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/company-pages/hakkimizda`)
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
            <HeaderTwo />
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
            <Certification aboutData={aboutData} />
            <Team aboutData={aboutData} />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default AboutUs;