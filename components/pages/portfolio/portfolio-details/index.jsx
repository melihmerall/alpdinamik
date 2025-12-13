"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import PortfolioDetailsMain from "./portfolio-details";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";

const PortfolioDetails = ({singleData}) => {
    return (
        <>
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title={singleData?.title} innerTitle={singleData?.title} backgroundImage={singleData?.breadcrumbImageUrl} />
            <PortfolioDetailsMain singleData={singleData} />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default PortfolioDetails;