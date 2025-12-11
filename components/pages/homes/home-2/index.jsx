import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import HeaderTwo from "@/components/layout/headers/header-two";
import BannerTwo from "./banner";
import AboutTwo from "./about";
import PortfolioTwo from "./portfolio";
import FaqArea from "./faq";
import PricingPlan from "./pricing";
import BlogTwo from "./blog";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const HomeTwo = async () => {
    return (
        <>
            <SEO pageTitle="Lineer Hareket Sistemleri ve Mühendislik Çözümleri" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BannerTwo />
            {/* Decorative Wave Separator */}
            <div className="banner-about-separator">
                <svg 
                    className="wave-separator" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 1440 120" 
                    preserveAspectRatio="none"
                >
                    <path 
                        fill="#ffffff" 
                        d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                    ></path>
                </svg>
            </div>
            <AboutTwo />

            <PricingPlan />
            <BlogTwo />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default HomeTwo;