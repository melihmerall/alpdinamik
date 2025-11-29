"use client"
import SEO from "../../../data/seo";
import HeaderTwo from "../../../layout/headers/header-two";
import BreadCrumb from "../../common/breadcrumb";
import TeamMain from "./team";
import FooterOne from "../../../layout/footers/footer-one";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const TeamPage = () => {
    return (
        <>
            <SEO pageTitle="Our Team" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="Our Team" innerTitle="Our Team" />
            <TeamMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default TeamPage;