"use client";
import { useState, useEffect } from 'react';
import SEO from "@/components/data/seo";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "../common/breadcrumb";
import MissionVisionMain from "./mission-vision";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";

const MissionVision = () => {
    const [siteSettings, setSiteSettings] = useState(null);
    const [missionVisionData, setMissionVisionData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsRes, dataRes] = await Promise.all([
                    fetch('/api/site-settings'),
                    fetch('/api/company-pages/misyon-vizyon')
                ]);
                
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setSiteSettings(data);
                }

                if (dataRes.ok) {
                    const data = await dataRes.json();
                    setMissionVisionData(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const breadcrumbBgImage = missionVisionData?.breadcrumbImageUrl
        ? missionVisionData.breadcrumbImageUrl
        : missionVisionData?.imageUrl
        ? missionVisionData.imageUrl
        : siteSettings?.defaultBreadcrumbImageUrl
        ? siteSettings.defaultBreadcrumbImageUrl
        : '/assets/img/breadcrumb.jpg';

    const pageTitle = missionVisionData?.title || "Misyon ve Vizyon";

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
            <MissionVisionMain missionVisionData={missionVisionData} />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default MissionVision;

