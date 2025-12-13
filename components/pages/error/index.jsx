"use client";
import SEO from '@/components/data/seo';
import BreadCrumb from '../common/breadcrumb';
import HeaderFour from '@/components/layout/headers/header-four';
import Error from './error';
import FooterOne from '@/components/layout/footers/footer-one';
import CustomCursor from '../common/cursor';
import SwitchTab from '../common/dark-light';
import ScrollToTop from '../common/scroll/scroll-to-top';
const ErrorPage = () => {
    return (
        <>
            <SEO pageTitle='Not Found' />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb title='Page Not Found' innerTitle='404' />
            <Error />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default ErrorPage;