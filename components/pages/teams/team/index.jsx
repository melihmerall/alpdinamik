"use client"
import SEO from "../../../data/seo";
import HeaderFour from "../../../layout/headers/header-four";
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
            <HeaderFour />
            <BreadCrumb title="Our Team" innerTitle="Our Team" />
            <TeamMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default TeamPage;