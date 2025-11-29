"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import BlogSingleMain from "./blog-details";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";
import HeaderTwo from "@/components/layout/headers/header-two";

const BlogDetails = ({singleData}) => {
    const firstThreeWords = singleData?.title.split(' ').slice(0, 3).join(' ') + '...';
    return (
        <>
            <SEO pageTitle={singleData?.title} />
            <SwitchTab />
            <CustomCursor />
            <HeaderTwo />
            <BreadCrumb title={firstThreeWords} innerTitle={singleData?.title} />
            <BlogSingleMain singleData={singleData}/>
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default BlogDetails;