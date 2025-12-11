"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import BlogGridMain from "./blog-grid";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import HeaderTwo from "@/components/layout/headers/header-two";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";


const BlogGrid = () => {
    return (
        <>
            <SEO pageTitle='Blog Grid' />
            <SwitchTab />
            <CustomCursor />
            <HeaderTwo />
            <BreadCrumb title="Blog Grid" innerTitle="Blog Grid" />
            <BlogGridMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default BlogGrid;