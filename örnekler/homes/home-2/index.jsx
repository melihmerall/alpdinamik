"use client"
import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";
import BannerTwo from "./banner";
import ServicesTwo from "./services";
import AboutTwo from "./about";
import PortfolioTwo from "./portfolio";
import FaqArea from "./faq";
import PricingPlan from "./pricing";
import TestimonialTwo from "./testimonial";
import BlogTwo from "./blog";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const HomeTwo = () => {
    return (
        <>
            <SEO pageTitle="Renovation Business" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BannerTwo />
            <ServicesTwo />
            <AboutTwo />
            <PortfolioTwo />
            <FaqArea />
            <PricingPlan />
            <TestimonialTwo />
            <BlogTwo />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default HomeTwo;