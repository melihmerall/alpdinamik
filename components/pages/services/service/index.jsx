"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import ServicesMain from "./services";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import HeaderFour from "@/components/layout/headers/header-four";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";

const Services = () => {
    return (
        <>
            <SEO pageTitle="Hizmetlerimiz" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title="Hizmetlerimiz" innerTitle="Hizmetlerimiz" />
            <ServicesMain />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default Services;