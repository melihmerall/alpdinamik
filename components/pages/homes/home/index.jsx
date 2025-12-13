"use client";
import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BannerOne from "./banner";
import About from "./about";
import TextSlide from "./text-slide";
import Video from "./video";
import ChooseUs from "./choose-us";
import Portfolio from "./portfolio";
import CounterUp from "./counter";
import Experience from "./experience";
import ProductsSlider from "../home-2/products-slider";
import Blog from "./blog";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const HomeOne = () => {
    return (
        <div>
            <SEO pageTitle='Lineer Hareket Sistemleri ve Mühendislik Çözümleri' />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BannerOne />
            <About />
            <TextSlide />
            <Video />
            <ChooseUs />
            <Portfolio />
            <CounterUp />
            <Experience />
            <ProductsSlider />
            <Blog /> 
            <FooterOne />
            <ScrollToTop />
        </div>
    );
};

export default HomeOne;