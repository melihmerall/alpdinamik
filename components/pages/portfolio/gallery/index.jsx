"use client"
import SEO from "../../../data/seo";
import BreadCrumb from "../../common/breadcrumb";
import HeaderFour from "../../../layout/headers/header-four";
import PortfolioFilter from "./portfolio-filter";
import FooterOne from "../../../layout/footers/footer-one";
import CustomCursor from "../../common/cursor";
import SwitchTab from "../../common/dark-light";
import ScrollToTop from "../../common/scroll/scroll-to-top";

const PortfolioFilterPage = () => {
    return (
        <>
            <SEO pageTitle="Filterable Gallery" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title="Filterable Gallery" innerTitle="Filterable Gallery" />
            <PortfolioFilter />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default PortfolioFilterPage;