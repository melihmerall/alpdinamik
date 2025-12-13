"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import ThreeColumns from "./three-columns";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import HeaderFour from "@/components/layout/headers/header-four";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";

const PortfolioThreeColumns = () => {
    return (
        <>
            <SEO pageTitle='Referanslar' />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title="Referanslar" innerTitle="Referanslar" />
            <ThreeColumns />        
            <FooterTwo />          
            <ScrollToTop />
        </>
    );
};

export default PortfolioThreeColumns;