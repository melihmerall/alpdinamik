"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import ServicesSingleMain from "./services-single";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import HeaderTwo from "@/components/layout/headers/header-two";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";

const ServicesSingle = ({singleData}) => {
    const words = singleData.title.split(' ');
    const firstAndSecondWord = words.slice(0, 2).join(' ');
    return (
        <>
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title={firstAndSecondWord} innerTitle={singleData?.title} backgroundImage={singleData?.breadcrumbImageUrl} />
            <ServicesSingleMain singleData={singleData}/>
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default ServicesSingle;