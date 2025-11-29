import React from 'react';
import image from "../../../public/assets/img/page/who-we-are.jpg";
import Count from '../common/count';

const Certification = () => {
    return (
        <>
        <div className="certification section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-xl-4 col-lg-5 lg-mb-25">
                        <div className="certification-left section-padding pb-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Industry Certifications</span>
                            <h2 className="title_split_anim">Our Key Achievements Over the Years</h2>
                        </div>
                    </div>
                    <div className="col-xl-8 col-lg-7">
                        <div className="certification-right">
                            <img className="wow img_top_animation" src={image.src} alt="image" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="counter__one-area mt-80">
                            <div className="certification-right-counter">
                                <h2><Count number={678}/>+</h2>
                                <p>Complete Projects</p>
                            </div>
                            <div className="certification-right-counter">
                                <h2><Count number={120}/>+</h2>
                                <p>Team Members</p>
                            </div>
                            <div className="certification-right-counter">
                                <h2><Count number={635}/>+</h2>
                                <p>Client Reviews</p>
                            </div>
                            <div className="certification-right-counter">
                                <h2><Count number={89}/>+</h2>
                                <p>Winning Awards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
        </>
    );
};

export default Certification;