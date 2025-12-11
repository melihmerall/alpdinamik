import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import portfolioData from "../../../data/portfolio-data";

const PortfolioThree = () => {
    const slideControl = {
        spaceBetween: 25,
        centeredSlides: true,
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
                slidesPerView: 1.5,
            },
            1025: {
                slidesPerView: 3,
            },
            1600: {
                slidesPerView: 3.7,
            },
        },
    };
    return (
        <div className="portfolio__three section-padding">
            <div className="container">
                <div className="row al-end mb-60">
                    <div className="col-lg-8">
                        <div className="portfolio__three-title lg-t-center lg-mb-20">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Our Portfolio</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Showcasing Our Work</h2>
                        </div>
                    </div>
                    <div className="col-lg-4 wow fadeInDown" data-wow-delay=".4s">
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
            <div className="wow fadeInUp data_cursor" data-wow-delay=".5s" data-cursor-text="Drag">
                <Swiper className='portfolio_slide' modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                    {portfolioData?.map((data, id) => (
                        <SwiperSlide key={id}>
                            <div className="portfolio__three-item">
                                <img src={data.image.src} alt="image" />
                                <div className="portfolio__three-item-content">
                                    <Link href={`/portfolio/${data.id}`}><i className="flaticon flaticon-right-up"></i></Link>
                                    <span>{data.subtitle}</span>
                                    <h4><Link href={`/portfolio/${data.id}`}>{data.title}</Link></h4>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper> 
            </div>
        </div>
    );
};

export default PortfolioThree;