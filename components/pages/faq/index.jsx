"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../common/breadcrumb";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../common/scroll/scroll-to-top";
import FaqArea from "./faq";
import HeaderTwo from "@/components/layout/headers/header-two";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";

const Faq = () => {
    return (
        <>        
            <SEO pageTitle='FAQ' />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title='Question & Ans.' innerTitle="FAQ's" />
            <FaqArea />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default Faq;