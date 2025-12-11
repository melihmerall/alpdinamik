"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import FooterOne from "@/components/layout/footers/footer-one";
import FourColumns from "./four-columns";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import SwitchTab from "../../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";
import CustomCursor from "../../common/cursor";

const PortfolioFourColumns = () => {
    return (
        <>
            <SEO pageTitle='Portfolio Grid - 04 Columns' />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="04 Columns" innerTitle="Portfolio Grid" />
            <FourColumns />        
            <FooterOne />     
            <ScrollToTop />     
        </>
    );
};

export default PortfolioFourColumns;