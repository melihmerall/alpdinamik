import React from 'react';
import image1 from "../../../../public/assets/img/about/about-5.jpg";
import image2 from "../../../../public/assets/img/about/about-6.jpg";
import Count from '../../common/count';
import Link from "next/link";

const AboutFour = () => {
    return (
        <div className="about__four section-padding">
            <div className="container">
                <div className="row al-center">
                    <div className="col-lg-3 lg-mb-25">
                        <div className="about__four-left wow img_top_animation">
                            <img src={image1.src} alt="image" />
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="about__four-title">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">About Our Company</span>
                            <h2 className="mb-20 wow fadeInRight" data-wow-delay=".6s">Leading Construction Innovation With Digital Consulting</h2>
                            <p className="wow fadeInUp" data-wow-delay=".4s">We focus on optimizing efficiency, managing risks, and delivering innovative solutions tailored to meet unique project needs and enhance productivity.</p>
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link className="build_button mt-25" href="/history">Our Story<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-30">
                    <div className="col-lg-8">
                        <div className="about__four-counter">
                            <div className="row">
                                <div className="col-md-4 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
                                    <div className="about__four-counter-item">
                                        <div className="box">
                                            <h2><Count number={678}/>+</h2>
                                            <p>Complete Projects</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 wow fadeInUp" data-wow-delay=".7s">
                                    <div className="about__four-counter-item borders t-center md-t-left">
                                        <div className="box">
                                            <h2><Count number={120}/>+</h2>
                                            <p>Team Members</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 wow fadeInUp" data-wow-delay="1s">
                                    <div className="about__four-counter-item t-right md-t-left">
                                        <div className="box">
                                            <h2><Count number={635}/>+</h2>
                                            <p>Client Reviews</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 lg-mt-25">
                        <div className="about__four-right t-right wow img_right_animation">
                            <img src={image2.src} alt="image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutFour;