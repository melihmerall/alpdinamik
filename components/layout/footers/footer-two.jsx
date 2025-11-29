
import Link from "next/link";
import logo from "../../../public/assets/img/logo-2.png";
import subscribeBg from "../../../public/assets/img/page/banner-video.png";
import Social from "@/components/data/social";
import blogData from "@/components/data/blog-data";

const FooterTwo = () => {
    return (
        <>
            <div className="footer__two">
                <div className="subscribe__area">
                    <div className="container">
                        <div className="row align-items-center subscribe__area-bg" style={{backgroundImage: `url(${subscribeBg.src})`}}>
                            <div className="col-lg-6 lg-mb-40 lg-t-center">
                                <div className="subscribe__area-left title_split_anim">
                                    <h2>Begin Your Dream Project Today!</h2>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="subscribe__area-form wow fadeInUp" data-wow-delay=".4s">
                                    <form>
                                        <input type="email" name="email" placeholder="Email address" />
                                        <button className="build_button" type="submit">Subscribe Now</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="footer__two-widget">
                                <div className="footer__two-widget-about">
                                    <Link href="/"><img src={logo.src} alt="image" /></Link>
                                    <p>Redefining the construction industry with innovative solutions, cuttin-edge technology and sustainable practices</p>
                                    <div className="footer__two-widget-about-social">
                                        <Social />
                                    </div>							
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 md-mt-30">
                            <div className="footer__two-widget footer-border pl-60 md-pl-0">
                                <h4>Head Office</h4>
                                <div className="footer__two-widget-location">
                                    <div className="footer__two-widget-location-item">
                                        <div className="footer__two-widget-location-item-icon">
                                            <i className="flaticon-location"></i>
                                        </div>
                                        <div className="footer__two-widget-location-item-info">
                                            <Link href="https://www.google.com/maps">1234 Elm Street Springfield, IL 62704</Link>
                                        </div>
                                    </div>
                                    <h6>Branch Office</h6>
                                    <div className="footer__two-widget-location-item">
                                        <div className="footer__two-widget-location-item-icon">
                                            <i className="flaticon-location"></i>
                                        </div>
                                        <div className="footer__two-widget-location-item-info">
                                            <Link href="https://www.google.com/maps">2464 Royal Ln. Mesa, New Jersey 45463</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 lg-mt-30">
                            <div className="footer__two-widget footer-border pl-60 lg-pl-0">
                                <h4>Recent Post</h4>
                                <div className="all__sidebar-item-post">
                                    {blogData?.slice(0, 2)?.map((data, id) => (
                                        <div className="post__item" key={id}>
                                            <div className="post__item-image">
                                                <Link href={`/blog/${data.id}`}><img src={data.image.src} alt="image" /></Link>
                                            </div>
                                            <div className="post__item-title">
                                                <span><i className="far fa-calendar-alt"></i>Mar {data.date}, 2025</span>
                                                <h6><Link href={`/blog/${data.id}`}>{data.title}</Link></h6>
                                            </div>
                                        </div>
                                    ))}
                                </div>	
                            </div>
                        </div>
                    </div>
                </div>	
            </div>
            <div className="copyright__area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="copyright__area-content t-center">
                                <p>Copyright 2025 – ALPDİNAMİK  Tüm Hakları Saklıdır. <Link href="https://alpdinamik.com.tr/" target="_blank">ALPDİNAMİK</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FooterTwo;