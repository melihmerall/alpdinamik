import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import testimonialData from "../../../data/testimonial-data";

const testimonialItem = testimonialData.slice(0, 4);
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
            slidesPerView: 1.4,
        },
        1025: {
            slidesPerView: 2.4,
        },
        1600: {
            slidesPerView: 2.5,
        },
    },
};

const Testimonial = () => {

    return (
        <div className="testimonial__one section-padding">
            <div className="container">
                <div className="row al-end mb-60">
                    <div className="col-xl-6 col-lg-8">
                        <div className="testimonial__one-title lg-t-center lg-mb-20">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Testimonial</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Client Feedback and Success Stories</h2>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-4 wow fadeInDown" data-wow-delay=".4s">
                        <div className="slider-arrow jc-end lg-jc-center mb-10">
                            <div className="slider-arrow-prev testimonial_prev">
                                <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                            </div>
                            <div className="slider-arrow-next testimonial_next">
                                <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="testimonial_slide swiper lg-pl-10 lg-pr-10 wow fadeInUp data_cursor" data-wow-delay=".5s" data-cursor-text="Drag">
                <Swiper modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                    {testimonialItem?.map((data, id) => (
                        <SwiperSlide key={id}>
                            <div className="testimonial__one-item">
                                <div className="testimonial__one-item-client">
                                    <div className="testimonial__one-item-client-image">
                                        <img src={data.avatar.src} alt="image" />
                                    </div>
                                    <div className="testimonial__one-item-client-title">
                                        <h4>{data.name}</h4>
                                        <span>{data.position}</span>
                                    </div>
                                </div>
                                <p>{data.des}</p>
                                <div className="testimonial__one-item-reviews">
                                    <i className="flaticon-star"></i>
                                    <i className="flaticon-star"></i>
                                    <i className="flaticon-star"></i>
                                    <i className="flaticon-star"></i>
                                    <i className="flaticon-star"></i>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Testimonial;