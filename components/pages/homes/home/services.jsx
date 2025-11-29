import React from 'react';
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import servicesData from '../../../data/services-data';

const Services = () => {
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
        <div className="services__one section-padding">
            <div className="container">
                <div className="row al-end">
                    <div className="col-lg-8">
                        <div className="services__one-title lg-t-center lg-mb-20">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Hizmetlerimiz</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Uçtan Uca Mühendislik Çözümleri</h2>
                        </div>
                    </div>
                    <div className="col-lg-4 wow fadeInDown" data-wow-delay=".4s">
                        <div className="slider-arrow jc-end lg-jc-center mb-10">
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

export default Services;