import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import servicesData from '../../../data/services-data';

const ServicesTwo = () => {
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
            nextEl: ".service_next",
            prevEl: ".service_prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1025: {
                slidesPerView: 4,
            },
            1600: {
                slidesPerView: 4,
            },
        },
    };
    return (
        <div className="services__two section-padding">
            <div className="container">
                <div className="row al-end">
                    <div className="col-lg-12">
                        <div className="services__two-title t-center">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Expert Solutions</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Provide Quality Services</h2>
                        </div>
                    </div>
                </div>
                <div className="row mt-60 wow fadeInUp data_cursor" data-wow-delay=".5s" data-cursor-text="Drag">
                    <div className="col-xl-12 slider-area">
                        <Swiper modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                            {servicesData?.map((data, id) => (
                                <SwiperSlide key={id}>
                                    <div className="services__one-item">
                                        {data.icon}
                                        <h4><Link href={`/services/${data.id}`}>{data.title}</Link></h4>
                                        <Link className="more_btn" href={`/services/${data.id}`}>Read More <i className="flaticon-right-up"></i></Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="slider-arrow">
                            <div className="slider-arrow-prev service_prev">
                                <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                            </div>
                            <div className="slider-arrow-next service_next">
                                <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesTwo;