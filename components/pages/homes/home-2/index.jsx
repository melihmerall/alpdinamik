import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import HeaderFour from "@/components/layout/headers/header-four";
import BannerFour from "./banner-four";
import AboutFour from "./about-four";

// Import components directly - SSR enabled for better initial load
import ProductsSlider from "./products-slider";
import BlogTwo from "./blog";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const HomeTwo = () => {
    return (
        <>
            <SEO pageTitle="Lineer Hareket Sistemleri ve Mühendislik Çözümleri" />
            <CustomCursor />
            <HeaderFour />
            <BannerFour />
            <AboutFour />
            <ProductsSlider />
            <BlogTwo />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default HomeTwo;