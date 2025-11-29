"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import ThreeColumns from "./three-columns";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import HeaderTwo from "@/components/layout/headers/header-two";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";

const PortfolioThreeColumns = () => {
    return (
        <>
            <SEO pageTitle='Portfolio Grid - 03 Columns' />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="03 Columns" innerTitle="Portfolio Grid" />
            <ThreeColumns />        
            <FooterOne />          
            <ScrollToTop />
        </>
    );
};

export default PortfolioThreeColumns;