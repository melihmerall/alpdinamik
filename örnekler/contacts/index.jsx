"use client";
import SEO from "@/components/data/seo";
import FooterOne from "../../layout/footers/footer-one";
import HeaderTwo from "../../layout/headers/header-two";
import BreadCrumb from "../common/breadcrumb";
import CustomCursor from "../common/cursor";
import SwitchTab from "../common/dark-light";
import ContactMain from "./contact";

const ContactUs = () => {
    return (
        <>
            <SEO pageTitle="Contact Us" />
            <HeaderTwo />
            <CustomCursor />
            <SwitchTab />
            <BreadCrumb title="Contact Us" innerTitle="Contact Us" />
            <ContactMain />
            <div className="map section-padding pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12 wow fadeInUp" data-wow-delay=".4s">
                            <div className="map-area">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830894606!2d-74.11976383964463!3d40.69766374865767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1652012644726!5m2!1sen!2sbd" loading="lazy" title="London Eye, London, United Kingdom" aria-label="London Eye, London, United Kingdom"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterOne />
        </>
    );
};

export default ContactUs;