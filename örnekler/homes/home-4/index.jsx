"use client"
import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BannerFour from "./banner";
import AboutFour from "./about";
import ServicesFour from "./services";
import Advices from "./advices";
import PortfolioFour from "./portfolio";
import Industry from "./industry";
import TextSlide from "./text-slide";
import BlogFour from "./blog";
import FooterFour from "@/components/layout/footers/footer-four";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const HomeFour = () => {
    return (
        <>
            <SEO pageTitle="Digital Architecture" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BannerFour />
            <AboutFour />
            <ServicesFour />
            <Advices />
            <PortfolioFour />
            <Industry />
            <TextSlide />
            <BlogFour />
            <FooterFour />
            <ScrollToTop />
        </>
    );
};

export default HomeFour;
