"use client"
import SEO from "@/components/data/seo";
import BreadCrumb from "../../common/breadcrumb";
import BlogStandardMain from "./blog-standard";
import FooterOne from "@/components/layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import SwitchTab from "../../common/dark-light";
import CustomCursor from "../../common/cursor";
import HeaderFour from "@/components/layout/headers/header-four";


const BlogStandardPage = () => {
    return (
        <>
            <SEO pageTitle='Blog Standard' />
            <SwitchTab />
            <CustomCursor />
            <HeaderFour />
            <BreadCrumb title="Blog Standard" innerTitle="Blog Standard" />
            <BlogStandardMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default BlogStandardPage;