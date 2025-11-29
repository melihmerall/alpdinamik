"use client"
import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderThree from "@/components/layout/headers/header-three";
import BannerThree from "./banner";
import AboutThree from "./about";
import CounterUp from "./counter";
import Services from "./services";
import ChooseUs from "./choose-us";
import WorkProcess from "./process";
import PortfolioThree from "./portfolio";
import Industry from "./industry";
import Award from "./award";
import Blog from "./blog";
import FooterThree from "@/components/layout/footers/footer-three";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const HomeThree = () => {
    return (
        <>
            <SEO pageTitle="Modern Construction" />
            <CustomCursor />
            <SwitchTab />
            <HeaderThree />
            <BannerThree />
            <AboutThree />
            <CounterUp />
            <Services />
            <ChooseUs />
            <WorkProcess />
            <PortfolioThree />
            <Industry />
            <Award />
            <Blog />
            <FooterThree />
            <ScrollToTop />
        </>
    );
};

export default HomeThree;
