"use client";
import SEO from "@/components/data/seo";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";
import BreadCrumb from "../common/breadcrumb";
import CompanyHistory from "./history";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";

const History = () => {
    return (
        <>
            <SEO pageTitle="Misyon & Vizyon" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="Misyon & Vizyon" innerTitle="Misyon & Vizyon" />
            <CompanyHistory />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default History;