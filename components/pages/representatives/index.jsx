"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../common/breadcrumb";
import RepresentativesMain from "./representatives";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";
import HeaderFour from "@/components/layout/headers/header-four";
import SwitchTab from "../common/dark-light";
import CustomCursor from "../common/cursor";

const Representatives = () => {
    return (
        <>
            <SEO pageTitle="Temsilcilikler" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title="Temsilcilikler" innerTitle="Temsilcilikler" />
            <RepresentativesMain />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default Representatives;

