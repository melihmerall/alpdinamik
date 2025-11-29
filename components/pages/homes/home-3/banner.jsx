import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import brand1 from "../../../../public/assets/img/brand/brand-1.png";
import brand2 from "../../../../public/assets/img/brand/brand-2.png";
import brand3 from "../../../../public/assets/img/brand/brand-3.png";
import brand4 from "../../../../public/assets/img/brand/brand-4.png";
import brand5 from "../../../../public/assets/img/brand/brand-5.png";
import brand6 from "../../../../public/assets/img/brand/brand-6.png";
import brand7 from "../../../../public/assets/img/brand/brand-7.png";
import brand8 from "../../../../public/assets/img/brand/brand-8.png";
import image1 from "../../../../public/assets/img/banner/banner-1.jpg";
import image2 from "../../../../public/assets/img/banner/banner-2.jpg";
import image3 from "../../../../public/assets/img/banner/banner-3.jpg"; 
import banner from "../../../../public/assets/img/service/service-1.jpg"; 

const BannerThree = () => {
    const slideControl = {
        spaceBetween: 25,
        speed: 1000,
        loop: true,
        autoplay: {
            delay: 4000,
            reverseDirection: false,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.banner_next',
            prevEl: '.banner_prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1.3,
            },
            768: {
                slidesPerView: 2,
            },
            1025: {
                slidesPerView: 1.6,
            },
            1600: {
                slidesPerView: 1.7,
            },
        },    
    };
  	return (
		<>
            <div className="banner__three">
                <div className="container">
                    <div className="row al-end">
                        <div className="col-lg-9 lg-mb-10">
                            <div className="banner__three-content title_split_anim">
                                <h1>Modern <img className="wow img_left_animation" src={banner.src} alt="image" /></h1>
                                <h1>Building Concepts</h1>
                            </div>
                        </div>
                        <div className="col-lg-3 wow fadeInDown" data-wow-delay=".4s">
                            <div className="slider-arrow jc-end lg-jc-left mb-10">
                                <div className="slider-arrow-prev banner_prev">
                                    <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                                </div>
                                <div className="slider-arrow-next banner_next">
                                    <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row wow fadeInUp" data-wow-delay=".5s">
                        <div className="col-xl-12">
                            <div className="banner__three-slider">
                                <Swiper modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                                    <SwiperSlide><img src={image1.src} alt="image" /></SwiperSlide>
                                    <SwiperSlide><img src={image2.src} alt="image" /></SwiperSlide>
                                    <SwiperSlide><img src={image3.src} alt="image" /></SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="scroll__slider">
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
            </div>  
		</>
	);
};

export default BannerThree;
