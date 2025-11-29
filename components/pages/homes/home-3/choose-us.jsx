import React from 'react';
import image from "../../../../public/assets/img/page/choose-us.jpg";
import Link from "next/link";

const ChooseUs = () => {
    return (
        <>
            <div className="choose__three section-padding">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-xl-6 col-lg-5 lg-mb-25">
                            <div className="choose__three-left t-right mr-60 xl-mr-0">
                                <img className="lg_img_full wow img_left_animation" src={image.src} alt="image" />
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <div className="choose__three-right">
                                <div className="choose__three-right-title mb-40">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Why Choose US</span>
                                    <h2 className="title_split_anim mb-20">Solving Construction Challenges with Modern Techniques</h2>
                                    <p className="wow fadeInUp" data-wow-delay=".4s">In Today’s construction landscape, we leverage modern techniques like Building Information Modeling (BIM) and sustainable materials to effectively address challenges, ensuring timely project completion.</p>
                                </div>
                                <div className="wow fadeInDown" data-wow-delay="1.2s">
                                    <Link className="build_button" href="/contact-us">Started Today<i className="flaticon-right-up"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="choose__three-list section-padding pb-0">
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 lg-mb-25 wow fadeInUp" data-wow-delay=".4s">
                                        <div className="choose__three-list-item">
                                            <i className="flaticon-technology"></i>
                                            <h4>Proven Expertise</h4>
                                            <p>Our team brings years of experience, ensuring high-quality work for you</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 md-mb-25 wow fadeInUp" data-wow-delay=".7s">
                                        <div className="choose__three-list-item">
                                            <i className="flaticon-it-department"></i>
                                            <h4>Quality Assurance</h4>
                                            <p>Our commitment to quality control guarantees that every project meets</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="1s">
                                        <div className="choose__three-list-item">
                                            <i className="flaticon-cooperation"></i>
                                            <h4>Timely Delivery</h4>
                                            <p>We understand deadlines and we complete your projects on schedule</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>           
        </>
    );
};

export default ChooseUs;