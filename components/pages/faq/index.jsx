"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../common/breadcrumb";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";
import FaqArea from "./faq";
import HeaderFour from "@/components/layout/headers/header-four";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";

const Faq = () => {
    return (
        <>        
            <SEO pageTitle='Sıkça Sorulan Sorular' />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title='Sıkça Sorulan Sorular' innerTitle="SSS" />
            <FaqArea />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default Faq;