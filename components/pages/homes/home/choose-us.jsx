import React from 'react';
import image from "../../../../public/assets/img/page/experience.jpg";
import videoBg from "../../../../public/assets/img/shape/shape.png";
import Count from '../../common/count';
import Link from "next/link";

const ChooseUs = () => {
    return (
        <>
        <div className="choose__us section-padding">
            <div className="container">
                <div className="row al-center">
                    <div className="col-xl-6 xl-mb-25">
                        <div className="choose__us-left t-right mr-40 xl-mr-0">
                            <img className="wow img_left_animation" src={image.src} alt="image" />
                            <div className="choose__us-left-counter bounce_x" style={{backgroundImage: `url(${videoBg.src})`}}>
                                <h2><Count number={156}/>k</h2>
                                <p>Project Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="choose__us-right ml-30 xl-ml-0">
                            <div className="choose__us-right-title mb-40">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Why Choose US</span>
                                <h2 className="mb-30 wow fadeInRight" data-wow-delay=".6s">Modern Building Challenges & Solutions</h2>
                                <p className="wow fadeInUp" data-wow-delay=".4s">One significant challenge is managing project costs in an era of fluctuating material prices and labor shortages.</p>
                            </div>
                            <div className="choose__us-right-skill wow fadeInUp" data-wow-delay=".7s">
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
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link className="build_button mt-50" href="/request-quote">Start Today<i className="flaticon-right-up"></i></Link>
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