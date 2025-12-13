"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../common/breadcrumb";
import SectorsMain from "./sectors";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";
import HeaderFour from "@/components/layout/headers/header-four";
import SwitchTab from "../common/dark-light";
import CustomCursor from "../common/cursor";

const Sectors = () => {
    return (
        <>
            <SEO pageTitle="Sektörler" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title="Sektörler" innerTitle="Sektörler" />
            <SectorsMain />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default Sectors;

