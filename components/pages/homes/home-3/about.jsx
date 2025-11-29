import { useState } from "react";
import ModalVideo from "react-modal-video";
import image1 from "../../../../public/assets/img/about/about-3.jpg";
import image2 from "../../../../public/assets/img/about/about-2.jpg";

const AboutThree = () => {
    const [openVideo, setOpenVideo] = useState(false);
    const openVideoModal = () => {
        setOpenVideo(true);
    };
    return (
        <>
            <div className="about__three">
                <img className="about__three-image img_left_animation" src={image1.src} alt="image" />
                <div className="container">
                    <div className="row">
                        <div className="col-xl-5 col-lg-4"></div>
                        <div className="col-xl-7 col-lg-8">
                            <div className="about__three-right pt-120 lg-pt-30 pl-30 lg-pl-0">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">About Our Company</span>
                                <h2 className="wow fadeInRight" data-wow-delay=".6s">Advanced Solutions for Essential Construction Projects</h2>
                                <div className="row mt-20">
                                    <div className="col-lg-7 col-md-8 pr-25 md-mb-25">
                                        <p className="wow fadeInUp" data-wow-delay=".4s">We provide cutting-edge solutions that enhance project efficiency, ensure sustainability, and deliver superior results tailored to meet your construction needs.</p>
                                        <div className="wow fadeInDown" data-wow-delay="1.2s">
                                            <a className="build_button mt-20" href="about.html">Discover more<i className="flaticon-right-up"></i></a>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md-4 t-right">
                                        <div className="about__one-left-image wow fadeInRight" data-wow-delay=".5s">
                                            <img className="md_img_full" src={image2.src} alt="image" />
                                            <div className="video video-pulse">
                                                <span onClick={openVideoModal}><i className="fas fa-play"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalVideo className='video-modal' channel="youtube" autoplay isOpen={openVideo} videoId="SZEflIVnhH8" onClose={() => setOpenVideo(false)} />        
        </>
    );
};

export default AboutThree;