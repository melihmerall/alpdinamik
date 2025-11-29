import React from 'react';
import FormArea from './form';
import Link from 'next/link';

const ContactMain = () => {
    return (
        <>
            <div className="contact__area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 lg-mb-25">
                            <div className="contact__area-left mr-40 xl-mr-0">
                                <div className="title">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">İletişim</span>
                                    <h2 className="title_split_anim mb-25">Bizimle İletişime Geçin</h2>
                                    <p className="wow fadeInUp" data-wow-delay=".4s">Projenizle ilgili teknik sorularınız, ürün seçimi ve teklif talepleriniz için formu doldurabilir veya aşağıdaki iletişim kanallarından bize ulaşabilirsiniz.</p>
                                </div>
                                <div className="contact__area-left-contact wow fadeInUp" data-wow-delay=".7s">
                                    <div className="contact__area-left-contact-item">
                                        <div className="contact__area-left-contact-item-icon">
                                            <i className="flaticon-phone"></i>
                                        </div>
                                        <div className="contact__area-left-contact-item-content">
                                            <span>Telefon:</span>
                                            <h6><Link href="tel:+90 (212) 123 45 67">+90 (212) 123 45 67</Link></h6>
                                        </div>
                                    </div>
                                    <div className="contact__area-left-contact-item">
                                        <div className="contact__area-left-contact-item-icon">
                                            <i className="flaticon-email-3"></i>
                                        </div>
                                        <div className="contact__area-left-contact-item-content">
                                            <span>E-posta:</span>
                                            <h6><Link href="mailto:info@alpdinamik.com.tr">info@alpdinamik.com.tr</Link></h6>
                                        </div>
                                    </div>
                                    <div className="contact__area-left-contact-item">
                                        <div className="contact__area-left-contact-item-icon">
                                            <i className="flaticon-location-1"></i>
                                        </div>
                                        <div className="contact__area-left-contact-item-content">
                                            <span>Adres:</span>
                                            <h6><Link href="https://google.com/maps" target="_blank">İstanbul, Türkiye</Link></h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 wow fadeInRight" data-wow-delay=".4s">
                            <div className="contact__area-form">
                                <h4>Mesaj Gönderin</h4>
                                <FormArea />
                            </div>
                        </div>
                    </div>
                </div>
            </div>         
        </>
    );
};

export default ContactMain;