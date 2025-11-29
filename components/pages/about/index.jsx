"use client";
import SEO from "@/components/data/seo";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";
import BreadCrumb from "../common/breadcrumb";
import AboutMain from "./about";
import Video from "./video";
import Certification from "./certification";
import Team from "./team";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../common/scroll/scroll-to-top";

const AboutUs = () => {
    return (
        <>
            <SEO pageTitle="Hakkımızda" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="Hakkımızda" innerTitle="Hakkımızda" />
            <AboutMain />
            <Video />
            <Certification />
            <Team />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default AboutUs;