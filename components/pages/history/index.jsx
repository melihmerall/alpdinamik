"use client";
import SEO from "@/components/data/seo";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";
import BreadCrumb from "../common/breadcrumb";
import CompanyHistory from "./history";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../common/scroll/scroll-to-top";

const History = () => {
    return (
        <>
            <SEO pageTitle="About Us" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="Company History" innerTitle="Company History" />
            <CompanyHistory />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default History;