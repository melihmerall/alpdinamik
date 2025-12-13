"use client"
import SEO from "@/components/data/seo";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "../../common/breadcrumb";
import ServicesMain from "./service-two";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const ServicePageTwo = () => {
    return (
        <>
            <SEO pageTitle="Services Two" />
            <HeaderFour />
            <BreadCrumb title="Services Two" innerTitle="Services Two" />
            <ServicesMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default ServicePageTwo;