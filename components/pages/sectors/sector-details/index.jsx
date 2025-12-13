"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import SectorDetailsMain from "./sector-details";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";

const SectorDetails = ({singleData}) => {
    return (
        <>
            <SEO pageTitle={singleData?.title || "Sektör Detayı"} />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb 
                title={singleData?.title || "Sektör Detayı"} 
                innerTitle={singleData?.title || "Sektör Detayı"} 
                backgroundImage={singleData?.breadcrumbImageUrl || singleData?.imageUrl}
            />
            <SectorDetailsMain singleData={singleData} />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default SectorDetails;

