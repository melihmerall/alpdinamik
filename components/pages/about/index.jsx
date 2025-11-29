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
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../common/scroll/scroll-to-top";

const AboutUs = () => {
    return (
        <>
            <SEO pageTitle="About Us" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="About Us" innerTitle="About Us" />
            <AboutMain />
            <Video />
            <Certification />
            <Team />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default AboutUs;