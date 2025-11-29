import React from 'react';
import Link from "next/link";
import image from "../../../../public/assets/img/shape/content.png";
import brand1 from "../../../../public/assets/img/brand/brand-1.png";
import brand2 from "../../../../public/assets/img/brand/brand-2.png";
import brand3 from "../../../../public/assets/img/brand/brand-3.png";
import brand4 from "../../../../public/assets/img/brand/brand-4.png";
import brand5 from "../../../../public/assets/img/brand/brand-5.png";
import brand6 from "../../../../public/assets/img/brand/brand-6.png";
import brand7 from "../../../../public/assets/img/brand/brand-7.png";
import brand8 from "../../../../public/assets/img/brand/brand-8.png";

const BannerFour = () => {
    return (
        <div className="banner__four">
            <div className="bg-video">
                <video autoPlay muted loop playsInline><source src="https://html.themeori.net/buildgo/assets/img/banner/banner.mp4" type="video/mp4" /></video>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="banner__four-content">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".3s">Expert Solutions</span>
                                <h1 className="wow fadeInRight" data-wow-delay=".6s">Shaping Future</h1>
                                <h2 className="wow fadeInRight" data-wow-delay=".9s">Architecture</h2>
                                <div className="wow fadeInDown" data-wow-delay="1.2s">
                                    <Link className="build_button" href="/request-quote">Start Today<i className="flaticon-right-up"></i></Link>
                                </div>
                            <Link href="/request-quote"><img className="h_rotate" src={image.src} alt="image" /></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="banner__four-brand">
                            <div className="title">
                                <h4>Our Trusted Partners</h4>
                            </div>
                            <div className="scroll__slider">
                                <div className="text-slide">
                                    <div className="sliders text_scroll">
                                        <ul>
                                            <li><img src={brand1.src} alt="image" /></li>
                                            <li><img src={brand2.src} alt="image" /></li>
                                            <li><img src={brand3.src} alt="image" /></li>
                                            <li><img src={brand4.src} alt="image" /></li>
                                            <li><img src={brand5.src} alt="image" /></li>
                                            <li><img src={brand6.src} alt="image" /></li>
                                            <li><img src={brand7.src} alt="image" /></li>
                                            <li><img src={brand8.src} alt="image" /></li>
                                        </ul>
                                    </div>
                                    <div className="sliders text_scroll">
                                        <ul>
                                            <li><img src={brand1.src} alt="image" /></li>
                                            <li><img src={brand2.src} alt="image" /></li>
                                            <li><img src={brand3.src} alt="image" /></li>
                                            <li><img src={brand4.src} alt="image" /></li>
                                            <li><img src={brand5.src} alt="image" /></li>
                                            <li><img src={brand6.src} alt="image" /></li>
                                            <li><img src={brand7.src} alt="image" /></li>
                                            <li><img src={brand8.src} alt="image" /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerFour;