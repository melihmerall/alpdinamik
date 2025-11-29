import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import portfolioData from "../../../data/portfolio-data";

const portfolioItem = portfolioData.slice(0, 5);
const slideControl = {
    spaceBetween: 25,
    slidesPerView: 4,
    speed: 1000,
    loop: true,
    autoplay: {
        delay: 4000,
        reverseDirection: false,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.portfolio_next',
        prevEl: '.portfolio_prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1025: {
            slidesPerView: 3,
        },
        1600: {
            slidesPerView: 2.7,
        },
    },
};

const Portfolio = () => {

    return (
        <div className="portfolio__one">
            <div className="container">
                <div className="row al-end">
                    <div className="col-lg-7">
                        <div className="portfolio__one-title lg-t-center lg-mb-20">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Referanslarımız</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Tamamlanan Projelerimiz</h2>
                        </div>
                    </div>
                    <div className="col-lg-5 wow fadeInDown" data-wow-delay=".4s">
                        <div className="slider-arrow jc-end lg-jc-center mb-10">
                            <div className="slider-arrow-prev portfolio_prev">
                                <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                            </div>
                            <div className="slider-arrow-next portfolio_next">
                                <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Portfolio;