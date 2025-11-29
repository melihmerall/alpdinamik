import React from 'react';
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import servicesData from '../../../data/services-data';
import image from "../../../../public/assets/img/page/services.jpg";

const ServicesFour = () => {
    const slideControl = {
        spaceBetween: 25,
        slidesPerView: 3,
        speed: 1000,
        loop: true,
        autoplay: {
            delay: 4000,
            reverseDirection: false,
            disableOnInteraction: false,
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
        },
    };
    return (
        <div className="services__four section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-lg-6 lg-mb-25">
                        <div className="services__four-title section-padding pb-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Our Services</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Provide Quality Services</h2>
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link className="build_button mt-40" href="/services">more Services<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>            
                    <div className="col-xl-7 col-lg-6">
                        <div className="services__four-image wow img_top_animation">
                            <img src={image.src} alt="image" />
                        </div>
                    </div>
                </div>
                <div className="row mt-70 wow fadeInUp" data-wow-delay=".5s">
                    <div className="col-xl-12">
                        <div className="swiper services_four_slide data_cursor" data-cursor-text="Drag">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesFour;