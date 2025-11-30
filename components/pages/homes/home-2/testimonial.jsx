"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import { useState, useEffect } from 'react';
import brand1 from "../../../../public/assets/img/brand/brand-1.png";
import brand2 from "../../../../public/assets/img/brand/brand-2.png";
import brand3 from "../../../../public/assets/img/brand/brand-3.png";
import brand4 from "../../../../public/assets/img/brand/brand-4.png";
import brand5 from "../../../../public/assets/img/brand/brand-5.png";
import brand6 from "../../../../public/assets/img/brand/brand-6.png";
import brand7 from "../../../../public/assets/img/brand/brand-7.png";
import brand8 from "../../../../public/assets/img/brand/brand-8.png";

const TestimonialTwo = () => {
    const [testimonialData, setTestimonialData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTestimonials() {
            try {
                const response = await fetch('/api/testimonials?active=true&limit=5');
                if (response.ok) {
                    const data = await response.json();
                    setTestimonialData(data.data || []);
                }
            } catch (error) {
                console.error('Error loading testimonials:', error);
            } finally {
                setLoading(false);
            }
        }
        loadTestimonials();
    }, []);

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
            nextEl: '.testimonial_next',
            prevEl: '.testimonial_prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
                centeredSlides: false,
            },
            1025: {
                slidesPerView: 3,
            },
            1600: {
                slidesPerView: 4,
            },
        },
    };

    return (
        <>
            <div className="brand__area section-padding pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12 scroll__slider">
                            <div className="text-slide">
                                <div className="sliders text_scroll">
                                    <ul>
                                        <li><img src={brand1.src} alt="image" /></li>
                                        <li><img src={brand2.src} alt="image" /></li>
                                        <li><img src={brand3.src} alt="image" /></li>
                                        <li><img src={brand4.src} alt="image" /></li>
                                        <li><img src={brand5.src} alt="image" /></li>
                                        <li><img src={brand6.src} alt="image" /></li>
                                        <li><img src={brand7.src} alt="image" /></li>
                                        <li><img src={brand8.src} alt="image" /></li>
                                    </ul>
                                </div>
                                <div className="sliders text_scroll">
                                    <ul>
                                        <li><img src={brand1.src} alt="image" /></li>
                                        <li><img src={brand2.src} alt="image" /></li>
                                        <li><img src={brand3.src} alt="image" /></li>
                                        <li><img src={brand4.src} alt="image" /></li>
                                        <li><img src={brand5.src} alt="image" /></li>
                                        <li><img src={brand6.src} alt="image" /></li>
                                        <li><img src={brand7.src} alt="image" /></li>
                                        <li><img src={brand8.src} alt="image" /></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
            <div className="testimonial__two section-padding">
                <div className="testimonial_two_slide wow fadeInUp" data-wow-delay=".5s">
                    <Swiper modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                        {testimonialData?.map((data, id) => (
                            <SwiperSlide key={id}>
                                <div className="testimonial__one-item">
                                    <div className="testimonial__one-item-client">
                                        <div className="testimonial__one-item-client-image">
                                            <img src={data.imageUrl || '/assets/img/team/team-1.jpg'} alt="image" />
                                        </div>
                                        <div className="testimonial__one-item-client-title">
                                            <h4>{data.name}</h4>
                                            <span>{data.role}{data.company ? ` - ${data.company}` : ''}</span>
                                        </div>
                                    </div>
                                    <p>{data.message}</p>
                                    <div className="testimonial__one-item-reviews">
                                        {Array.from({ length: data.rating || 5 }).map((_, i) => (
                                            <i key={i} className="flaticon-star"></i>
                                        ))}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>     
        </>
    );
};

export default TestimonialTwo;