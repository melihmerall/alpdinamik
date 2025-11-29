import Link from "next/link";
import logo from "../../../public/assets/img/logo-2.png";
import Social from "@/components/data/social";

const FooterOne = () => {
    return (
        <>
            <div className="footer__one">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="footer__one-cta">
                                <div className="row al-center">
                                    <div className="col-lg-8 lg-t-center lg-mb-25">
                                        <div className="footer__one-cta-title title_split_anim">
                                            <h2>Projenizi Paylaşın — Mühendislik Çözümümüzle Tanışın!</h2>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="footer__one-cta-icon t-right lg-t-center wow fadeInDown" data-wow-delay="1.2s">
                                            <Link href="/contact-us"><i className="flaticon-right-up"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="footer__one-area">
                                <div className="row">
                                    <div className="col-lg-4 col-sm-6">
                                        <div className="footer__one-widget mr-40">
                                            <Link className="logo" href="/"><img src={logo.src} alt="logo" /></Link>
                                            <h5>Lineer hareket sistemlerinde mühendislik çözümleri</h5>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 sm-mt-30">
                                        <div className="footer__one-widget address">
                                            <h4>Adres</h4>
                                            <div className="footer__one-widget-address">
                                                <h6><Link href="https://www.google.com/maps">İstanbul, Türkiye</Link></h6>
                                                <h4><Link href="tel:+902121234567">+90 (212) 123 45 67</Link></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 lg-mt-30">
                                        <div className="footer__one-widget ml-40 lg-ml-0">
                                            <h4>Hızlı Linkler</h4>
                                            <div className="footer-widget-menu">
                                                <ul>
                                                    <li><Link href="/about-us">Hakkımızda</Link></li>
                                                    <li><Link href="/blog">Blog</Link></li>
                                                    <li><Link href="/portfolio/3-columns">Referanslar</Link></li>
                                                    <li><Link href="/contact-us">İletişim</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-sm-6 lg-mt-30">
                                        <div className="footer__one-widget address">
                                            <h4>Destek</h4>
                                            <div className="footer-widget-menu">
                                                <ul>
                                                    <li><Link href="/contact-us">Kullanım Şartları</Link></li>
                                                    <li><Link href="/contact-us">Gizlilik Politikası</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
            <div className="copyright__area">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-md-7">
                            <div className="copyright__area-content md-t-center md-mb-10">
                                <p>Copyright 2025 – ALPDİNAMİK  Tüm Hakları Saklıdır. <Link href="https://alpdinamik.com.tr/" target="_blank">ALPDİNAMİK</Link></p>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="copyright__area-social t-right md-t-center">
                                <Social />						
                            </div>
                        </div>
                    </div>
                </div>
            </div>       
        </>
    );
};

export default FooterOne;