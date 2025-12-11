import React from 'react';

const WorkProcess = () => {
    return (
        <>
            <div className="process__area section-padding">
                <div className="container">
                    <div className="row mb-75">
                        <div className="col-xl-12">
                            <div className="process__area-title t-center">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Our Process</span>
                                <h2 className="wow fadeInRight" data-wow-delay=".6s">The Journey of Your Project with Us</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row g-0">
                        <div className="col-lg-3 col-md-6 lg-mb-40 wow fadeInLeft" data-wow-delay=".3s">
                            <div className="process__area-item">
                                <h6>01</h6>
                                <h4>Initial Consultation</h4>
                                <p>Discuss project goals, budget, and timeline with our expert team</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 md-mb-40 wow fadeInLeft" data-wow-delay=".6s">
                            <div className="process__area-item pl-20 xl-pl-0">
                                <h6>02</h6>
                                <h4>Work Planning</h4>
                                <p>Comprehensive plan, including design, materials, and schedules</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 md-mb-40 wow fadeInLeft" data-wow-delay=".9s">
                            <div className="process__area-item pl-40 xl-pl-0">
                                <h6>03</h6>
                                <h4>Execution Phase</h4>
                                <p>Implement the plan with skilled professionals ensuring quality</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInLeft" data-wow-delay="1.2s">
                            <div className="process__area-item pl-40 xl-pl-0">
                                <h6>04</h6>
                                <h4>Final Review</h4>
                                <p>We addressing any concerns before project completion</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </>
    );
};

export default WorkProcess;