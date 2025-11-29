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
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Our Portfolio</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Discover Our Builds</h2>
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
                <div className="row mt-60 wow fadeInUp data_cursor" data-wow-delay=".5s" data-cursor-text="Drag">
                    <div className="col-xl-12">
                        <Swiper className='portfolio_slide' modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                            {portfolioItem?.map((data, id) => (
                                <SwiperSlide key={id}>
                                    <div className="portfolio__one-item">
                                        <img src={data.image.src} alt="image" />
                                        <div className="portfolio__one-item-content">
                                            <span>{data.subtitle}</span>
                                            <h4><Link href={`/portfolio/${data.id}`}>{data.title}</Link></h4>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;