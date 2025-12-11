"use client";
import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderOne from "@/components/layout/headers/header-one";
import BannerOne from "./banner";
import About from "./about";
import TextSlide from "./text-slide";
import Services from "./services";
import Video from "./video";
import ChooseUs from "./choose-us";
import Portfolio from "./portfolio";
import CounterUp from "./counter";
import Experience from "./experience";
import Testimonial from "./testimonial";
import Blog from "./blog";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const HomeOne = () => {
    return (
        <div>
            <SEO pageTitle='Construction Company' />
            <CustomCursor />
            <SwitchTab />
            <HeaderOne />
            <BannerOne />
            <About />
            <TextSlide />
            <Services />
            <Video />
            <ChooseUs />
            <Portfolio />
            <CounterUp />
            <Experience />
            <Testimonial /> 
            <Blog /> 
            <FooterOne />
            <ScrollToTop />
        </div>
    );
};

export default HomeOne;