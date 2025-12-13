import SEO from "@/components/data/seo";
import CustomCursor from "../../common/cursor";
import HeaderFour from "@/components/layout/headers/header-four";
import BannerFour from "./banner-four";
import AboutFour from "./about-four";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load heavy components for better initial load performance
const ProductsSlider = dynamic(() => import("./products-slider"), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '400px' }}></div>
});
const PortfolioTwo = dynamic(() => import("./portfolio"), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '400px' }}></div>
});
const FaqArea = dynamic(() => import("./faq"), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '200px' }}></div>
});
const BlogTwo = dynamic(() => import("./blog"), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '400px' }}></div>
});
const FooterTwo = dynamic(() => import("@/components/layout/footers/footer-two"), { 
  ssr: false 
});
const ScrollToTop = dynamic(() => import("../../common/scroll/scroll-to-top"), { 
  ssr: false 
});

const HomeTwo = async () => {
    return (
        <>
            <SEO pageTitle="Lineer Hareket Sistemleri ve Mühendislik Çözümleri" />
            <CustomCursor />
            <HeaderFour />
            <BannerFour />
            <AboutFour />

            <Suspense fallback={<div style={{ minHeight: '400px' }}></div>}>
                <ProductsSlider />
            </Suspense>

            <Suspense fallback={<div style={{ minHeight: '400px' }}></div>}>
                <BlogTwo />
            </Suspense>

            <Suspense fallback={<div style={{ minHeight: '200px' }}></div>}>
                <FooterTwo />
            </Suspense>

            <ScrollToTop />
        </>
    );
};

export default HomeTwo;