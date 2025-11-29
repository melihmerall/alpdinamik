import React from 'react';
import image from "../../../../public/assets/img/service/services-1.jpg";

const FaqArea = () => {
    return (
        <>            
            <div className="faq__area section-padding">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-xl-6 col-lg-5 lg-mb-25">
                            <div className="faq__area-image mr-50 xl-mr-0">
                                <img className="wow img_right_animation" src={image.src} alt="image" />
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <div className="faq__area-right">
                                <div className="faq__area-right-title mb-40">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Common Inquiries</span>
                                    <h2 className="wow fadeInRight" data-wow-delay=".6s">Answers to Your Construction Queries</h2>
                                </div>
                                <div className="wow fadeInUp" data-wow-delay=".9s" id="accordionExample">
                                    <div className="faq-item">
                                        <h5 className="icon" data-bs-toggle="collapse" data-bs-target="#collapseOne">1. What services do you offer?</h5>
                                        <div id="collapseOne" className="faq-item-body collapse show" data-bs-parent="#accordionExample">
                                            <p>We offer a range of services including construction management, design-build solutions, renovations, and specialty contracting for both residential and commercial projects</p>
                                        </div>
                                    </div>
                                    <div className="faq-item">
                                        <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">2. Do you provide free estimates?</h5>
                                        <div id="collapseTwo" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                            <p>Yes, we offer free estimates for all potential projects. We assess your requirements and provide a detailed quote without any obligation</p>
                                        </div>
                                    </div>
                                    <div className="faq-item">
                                        <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">3. Are you licensed and insured?</h5>
                                        <div id="collapseThree" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                            <p>Yes, we are fully licensed and insured to operate in our service areas. This ensures that your project is protected and complies with all local regulations</p>
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

export default FaqArea;