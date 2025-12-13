"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import BlogSingleMain from "./blog-details";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";
import HeaderFour from "@/components/layout/headers/header-four";

const BlogDetails = ({singleData}) => {
    const firstThreeWords = singleData?.title.split(' ').slice(0, 3).join(' ') + '...';
    return (
        <>
            <SwitchTab />
            <CustomCursor />
            <HeaderFour />
            <BreadCrumb title={firstThreeWords} innerTitle={singleData?.title} backgroundImage={singleData?.breadcrumbImageUrl} />
            <BlogSingleMain singleData={singleData}/>
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default BlogDetails;