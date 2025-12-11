import React from 'react';
import Count from '../../common/count';
import image from "../../../../public/assets/img/page/cta.jpg";
import icon from "../../../../public/assets/img/icon/star-dark.svg";
import content from "../../../../public/assets/img/shape/content-1.png";

const TextSlide = () => {
    return (
        <div className="text__slide section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 lg-mb-30">
                        <div className="text__slide-title mt-35 lg-mt-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Construction design</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Digital Consulting The Key to Smarter Building</h2>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="text__slide-right">
                            <img className="wow img_left_animation" src={image.src} alt="image" />
                            <div className="text__slide-right-counter wow fadeInDown" data-wow-delay="1.2s" style={{backgroundImage: `url(${content.src})`}}>
                                <h2><Count number={29}/>+</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll__slider">
                <div className="text-slide">
                    <div className="sliders text_scroll">
                        <ul>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Residential</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Architecture</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Community</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Healthcare</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Seaside Resort</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Modern</a></li>
                        </ul>
                    </div>
                    <div className="sliders text_scroll">
                        <ul>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Residential</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Architecture</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Community</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Healthcare</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Seaside Resort</a></li>
                            <li><img src={icon.src} alt="icon" /><a href="portfolio-details">Modern</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextSlide;