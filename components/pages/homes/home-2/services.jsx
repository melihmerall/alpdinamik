"use client"
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import { useState, useEffect } from 'react';

const ServicesTwo = () => {
    const [servicesData, setServicesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadServices() {
            try {
                const response = await fetch('/api/services');
                if (response.ok) {
                    const data = await response.json();
                    setServicesData(data.data || []);
                }
            } catch (error) {
                console.error('Error loading services:', error);
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);
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
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Hizmetlerimiz</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Kaliteli Mühendislik Çözümleri Sunuyoruz</h2>
                        </div>
                    </div>
                </div>
                <div className="row mt-60 wow fadeInUp" data-wow-delay=".5s">
                    <div className="col-xl-12 slider-area">
                        <Swiper modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                            {servicesData?.map((data, id) => (
                                <SwiperSlide key={id}>
                                    <div className="services__one-item">
                                        {data.icon && <i className={data.icon}></i>}
                                        <h4><Link href={`/services/${data.slug}`}>{data.title}</Link></h4>
                                        <Link className="more_btn" href={`/services/${data.slug}`}>Daha Fazla Oku <i className="flaticon-right-up"></i></Link>
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