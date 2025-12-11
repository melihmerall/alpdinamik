"use client"
import SEO from '@/components/data/seo';
import BreadCrumb from '../common/breadcrumb';
import RequestQuoteMain from './request-quote';
import FooterOne from '@/components/layout/footers/footer-one';
import ScrollToTop from '../common/scroll/scroll-to-top';
import CustomCursor from '../common/cursor';
import SwitchTab from '../common/dark-light';
import HeaderTwo from '@/components/layout/headers/header-two';

const RequestQuotePage = () => {
    return (
        <>
            <SEO pageTitle="Request Quote" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="Request Quote" innerTitle="Request Quote" />
            <RequestQuoteMain />
            <FooterOne />
            <ScrollToTop />
        </>
    );
};

export default RequestQuotePage;