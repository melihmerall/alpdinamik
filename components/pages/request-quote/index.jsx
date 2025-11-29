"use client"
import SEO from '@/components/data/seo';
import BreadCrumb from '../common/breadcrumb';
import RequestQuoteMain from './request-quote';
import FooterTwo from '@/components/layout/footers/footer-two';
import ScrollToTop from '../common/scroll/scroll-to-top';
import CustomCursor from '../common/cursor';
import SwitchTab from '../common/dark-light';
import HeaderTwo from '@/components/layout/headers/header-two';

const RequestQuotePage = () => {
    return (
        <>
            <SEO pageTitle="Projenizi Paylaşın" />
            <CustomCursor />
            <SwitchTab />
            <HeaderTwo />
            <BreadCrumb title="Projenizi Paylaşın" innerTitle="Projenizi Paylaşın" />
            <RequestQuoteMain />
            <FooterTwo />
            <ScrollToTop />
        </>
    );
};

export default RequestQuotePage;