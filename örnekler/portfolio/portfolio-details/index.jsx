"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import PortfolioDetailsMain from "./portfolio-details";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";

const PortfolioDetails = ({singleData}) => {
    return (
        <>
            <SEO pageTitle={singleData?.title} />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title={singleData?.title} innerTitle={singleData?.title} />
            <PortfolioDetailsMain singleData={singleData} />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default PortfolioDetails;