"use client"
import SEO from "@/components/data/seo";
import HeaderOne from "@/components/layout/headers/header/header-one";
import BreadCrumb from "../../common/breadcrumb";
import ServicesMain from "./service-two";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const ServicePageTwo = () => {
    return (
        <>
            <SEO pageTitle="Services Two" />
            <HeaderOne />
            <BreadCrumb title="Services Two" innerTitle="Services Two" />
            <ServicesMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default ServicePageTwo;