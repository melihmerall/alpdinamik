import { useState } from 'react';
import Link from "next/link";
import ModalVideo from "react-modal-video";
import image1 from "../../../../public/assets/img/about/about-1.jpg";
import image2 from "../../../../public/assets/img/about/about-2.jpg";

const About = () => {
    const [openVideo, setOpenVideo] = useState(false);
    const openVideoModal = () => {
      setOpenVideo(true);
    }; 
    return (
        <>
            <div className="about__one section-padding">
                <div className="container">
                    <div className="row al-end">
                        <div className="col-lg-7 lg-mb-25">
                            <div className="about__one-left">
                                <div className="about__one-left-title">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">About Our Company</span>
                                    <h2 className="wow fadeInRight" data-wow-delay=".6s">Innovative Solutions for Complex Projects</h2>
                                </div>
                                <div className="row al-center mt-45">
                                    <div className="col-md-4 md-mb-25">
                                        <div className="about__one-left-image wow fadeInLeft" data-wow-delay=".4s">
                                            <img className="md_img_full" src={image2.src} alt="image" />
                                            <div className="video video-pulse">
                                                <span onClick={openVideoModal}><i className="fas fa-play"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 pl-50 xl-pl-10">
                                        <div className="about__one-left-list">
                                            <div className="about__one-left-list-item wow fadeInUp" data-wow-delay=".3s">
                                                <i className="flaticon-technology"></i>
                                                <div className="about__one-left-list-item-content">
                                                    <h4>Modern Technology</h4>
                                                    <p>Cutting-edge tools and software streamline processes, enabling teams to deliver</p>
                                                </div>
                                            </div>
                                            <div className="about__one-left-list-item wow fadeInUp" data-wow-delay=".5s">
                                                <i className="flaticon-team"></i>
                                                <div className="about__one-left-list-item-content">
                                                    <h4>Experience Engineers</h4>
                                                    <p>Knowledge and practical skills enable them to tackle challenges from start to finish</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="wow fadeInDown" data-wow-delay="1.2s">
                                            <Link className="build_button mt-40" href="/about">Discover more<i className="flaticon-right-up"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="about__one-right t-right">
                                <img className="wow img_right_animation lg_img_full" src={image1.src} alt="image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalVideo className='video-modal' channel="youtube" autoplay isOpen={openVideo} videoId="SZEflIVnhH8" onClose={() => setOpenVideo(false)} />
        </>
    );
};

export default About;