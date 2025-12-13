"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import BlogGridMain from "./blog-grid";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import HeaderFour from "@/components/layout/headers/header-four";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";


const BlogGrid = () => {
    return (
        <>
            <SEO pageTitle='Blog' />
            <SwitchTab />
            <CustomCursor />
            <HeaderFour />
            <BreadCrumb title="Blog" innerTitle="Blog" />
            <BlogGridMain />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default BlogGrid;