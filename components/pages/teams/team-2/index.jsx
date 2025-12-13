"use client"
import SEO from "../../../data/seo";
import HeaderFour from "../../../layout/headers/header-four";
import BreadCrumb from "../../common/breadcrumb";
import TeamMain from "./team";
import FooterOne from "../../../layout/footers/footer-one";
import ScrollToTop from "../../common/scroll/scroll-to-top";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";

const TeamPageTwo = () => {
    return (
        <>
            <SEO pageTitle="Team Two" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title="Team Two" innerTitle="Team Two" />
            <TeamMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default TeamPageTwo;