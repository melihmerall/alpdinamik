import Link from "next/link";
import image from "../../../public/assets/img/about/about-4.jpg";
import bgImage from "../../../public/assets/img/portfolio/portfolio-8.jpg";


const AboutMain = () => {
    return (
        <>
            <div className="mission__area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 lg-mb-25">
                            <div className="mission__area-left mr-40 xl-mr-0">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Our Mission</span>
                                <h2 className="title_split_anim">Dedicated to Delivering Value and Excellence</h2>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mission__area-right">
                                <div className="row">
                                    <div className="col-md-6 md-mb-25 wow fadeInUp" data-wow-delay=".6s">
                                        <div className="experience__area-list-item">
                                            <i className="flaticon-team"></i>
                                            <div className="experience__area-list-item-content">
                                                <h4>Project Planning</h4>
                                                <p>Ensuring every detail is considered designing</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 wow fadeInUp" data-wow-delay=".9s">
                                        <div className="experience__area-list-item">
                                            <i className="flaticon-technology"></i>
                                            <div className="experience__area-list-item-content">
                                                <h4>Labor Preparation</h4>
                                                <p>We take pride in our quality craftsmanship</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about__five section-padding pt-0">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-lg-5 lg-mb-25">
                            <div className="about__five-image wow img_left_animation">
                                <img src={image.src} alt="image" />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="about__five-right ml-70 xl-ml-0">
                                <div className="about__five-right-title">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">About Our Company</span>
                                    <h2 className="title_split_anim">Trusted Partner in Construction and Design</h2>
                                </div>
                                <div className="features wow fadeInUp" data-wow-delay=".3s" style={{backgroundImage: `url(${bgImage.src})`}}>
                                    <h3>Building Trust<br/>Since 1989</h3>
                                </div>
                                <p className="wow fadeInUp" data-wow-delay=".6s">Our journey began with a commitment to excellence, and that commitment remains at the core of our operations today. We’ve grown from a small local business into a trusted partner for both residential and commercial.</p>
                                <div className="item_bounce">
                                    <Link className="build_button mt-20" href="/portfolio">See Projects<i className="flaticon-right-up"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutMain;