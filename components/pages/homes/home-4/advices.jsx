import React from 'react';
import Link from "next/link";
import Count from '../../common/count';
import image from "../../../../public/assets/img/page/skill.jpg";

const Advices = () => {
    return (
        <div className="success__area section-padding">
            <div className="container">
                <div className="row al-center">
                    <div className="col-lg-6 lg-mb-25">
                        <div className="success__area-title mr-70 xl-mr-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Construction Advices</span>
                            <h2 className="mb-20 wow fadeInRight" data-wow-delay=".6s">Building Success With Expert Advisory Services</h2>
                            <p className="wow fadeInUp" data-wow-delay=".4s">With a focus on innovation and sustainability, we help you navigate complex challenges, ensuring</p>
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link className="build_button mt-25" href="/contact-us">Get Advices<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="success__area-right">
                            <img className="lg_img_full wow img_top_animation" src={image.src} alt="image" />
                            <div className="success__area-right-skill mt-40 wow fadeInUp" data-wow-delay=".5s">
                                <div className="skill__area-item">
                                    <div className="skill__area-item-content">
                                        <h6>Building Construction</h6> 
                                        <span className="skill__area-item-count"><Count number={89}/>%</span>
                                    </div>
                                    <div className="skill__area-item-inner">
                                        <div className="skill__area-item-bar wow active_bar" style={{ width: '89%' }}></div>
                                    </div>
                                </div>
                                <div className="skill__area-item">
                                    <div className="skill__area-item-content">
                                        <h6>Interiors Design</h6> 
                                        <span className="skill__area-item-count"><Count number={70}/>%</span>
                                    </div>
                                    <div className="skill__area-item-inner">
                                        <div className="skill__area-item-bar wow active_bar" style={{ width: '70%' }}></div>
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

export default Advices;