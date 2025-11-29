import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Autoplay, EffectFade, Navigation } from 'swiper/modules';
import banner1 from "../../../../public/assets/img/banner/banner-1.jpg";
import banner2 from "../../../../public/assets/img/banner/banner-2.jpg";
import banner3 from "../../../../public/assets/img/banner/banner-3.jpg";
import Link from "next/link";

const BannerTwo = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

  	return (
		<>
			<div className="banner__two">
				<Swiper
					thumbs={{ swiper: thumbsSwiper }}
					effect= 'fade'
					loop={true}
					autoplay={{
						delay: 4500,
						disableOnInteraction: false,
						reverseDirection: false,
					}}
					navigation={{
						nextEl: '.banner_next',
						prevEl: '.banner_prev',
					}}
					modules={[Autoplay, Thumbs, EffectFade, Navigation]}
				>
				<SwiperSlide>
					<div className="banner__two-area">	
						<div className="banner__two-area-image" style={{backgroundImage: `url(${banner1.src})`}}></div>
						<div className="container">
							<div className="row align-items-center">
								<div className="col-xl-12">
									<div className="banner__two-content">
										<span className="subtitle">Best Construction</span>
										<h2>Delivering Quality</h2>
										<h1>Projects</h1>
										<Link className="build_button" href="/about-us">Discover More<i className="flaticon-right-up"></i></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="banner__two-area">	
						<div className="banner__two-area-image" style={{backgroundImage: `url(${banner2.src})`}}></div>
						<div className="container">
							<div className="row align-items-center">
								<div className="col-xl-12">
									<div className="banner__two-content">
										<span className="subtitle">Structural Mastery</span>
										<h2>Building with</h2>
										<h1>Integrity</h1>
										<Link className="build_button" href="/about-us">Discover More<i className="flaticon-right-up"></i></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="banner__two-area">	
						<div className="banner__two-area-image" style={{backgroundImage: `url(${banner3.src})`}}></div>
						<div className="container">
							<div className="row align-items-center">
								<div className="col-xl-12">
									<div className="banner__two-content">
										<span className="subtitle">Future Foundations</span>
										<h2>Shaping Modern</h2>
										<h1>Spaces</h1>
										<Link className="build_button" href="/about-us">Discover More<i className="flaticon-right-up"></i></Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</SwiperSlide>
				</Swiper>
			</div>
			<div className="banner__two-slide">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="banner__two-slide-area">
								<div className="banner__two-slide-area-thumb dark_image">
									<Swiper
										onSwiper={setThumbsSwiper}
										slidesPerView={3}
										freeMode={true}
										watchSlidesProgress={true}
										autoplay={{
											delay: 4500,
											disableOnInteraction: false,
											reverseDirection: false,
										}}
										modules={[FreeMode, Thumbs, Autoplay]}
									>
										<SwiperSlide className='banner__two-slide-area-thumb-item'>
											<img src={banner1.src} alt="banner" />
											<h6>Delivering Quality Projects</h6>
										</SwiperSlide>
										<SwiperSlide className='banner__two-slide-area-thumb-item'>
											<img src={banner2.src} alt="banner" />
											<h6>Building with Integrity</h6>
										</SwiperSlide>
										<SwiperSlide className='banner__two-slide-area-thumb-item'>
											<img src={banner3.src} alt="banner" />
											<h6>Shaping Modern Spaces</h6>
										</SwiperSlide>
									</Swiper>
								</div>
								<div className="banner__two-slide-area-arrow">
									<div className="banner__two-slide-area-arrow-prev banner_prev"><i className="fal fa-long-arrow-left"></i></div>
									<div className="banner__two-slide-area-arrow-next banner_next"><i className="fal fa-long-arrow-right"></i></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BannerTwo;
