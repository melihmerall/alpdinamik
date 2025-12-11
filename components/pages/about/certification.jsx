import React from 'react';
import image from "../../../public/assets/img/page/who-we-are.jpg";
import Count from '../common/count';

const Certification = ({ aboutData }) => {
    const subtitle = aboutData?.certificationSubtitle || "Industry Certifications";
    const title = aboutData?.certificationTitle || "Our Key Achievements Over the Years";
    const imageUrl = aboutData?.certificationImageUrl || image.src;
    const stat1Number = aboutData?.certificationStat1Number || 678;
    const stat1Label = aboutData?.certificationStat1Label || "Complete Projects";
    const stat2Number = aboutData?.certificationStat2Number || 120;
    const stat2Label = aboutData?.certificationStat2Label || "Team Members";
    const stat3Number = aboutData?.certificationStat3Number || 635;
    const stat3Label = aboutData?.certificationStat3Label || "Client Reviews";
    const stat4Number = aboutData?.certificationStat4Number || 89;
    const stat4Label = aboutData?.certificationStat4Label || "Winning Awards";

    return (
        <>
        <div className="certification section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-xl-4 col-lg-5 lg-mb-25">
                        <div className="certification-left section-padding pb-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">{subtitle}</span>
                            <h2 className="title_split_anim">{title}</h2>
                        </div>
                    </div>
                    <div className="col-xl-8 col-lg-7">
                        <div className="certification-right">
                            <img className="wow img_top_animation" src={imageUrl} alt="image" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="counter__one-area mt-80">
                            {stat1Number && stat1Label && (
                                <div className="certification-right-counter">
                                    <h2><Count number={stat1Number}/>+</h2>
                                    <p>{stat1Label}</p>
                                </div>
                            )}
                            {stat2Number && stat2Label && (
                                <div className="certification-right-counter">
                                    <h2><Count number={stat2Number}/>+</h2>
                                    <p>{stat2Label}</p>
                                </div>
                            )}
                            {stat3Number && stat3Label && (
                                <div className="certification-right-counter">
                                    <h2><Count number={stat3Number}/>+</h2>
                                    <p>{stat3Label}</p>
                                </div>
                            )}
                            {stat4Number && stat4Label && (
                                <div className="certification-right-counter">
                                    <h2><Count number={stat4Number}/>+</h2>
                                    <p>{stat4Label}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>    
        </>
    );
};

export default Certification;