"use client"
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Autoplay, EffectFade, Navigation } from 'swiper/modules';
import Link from "next/link";

const BannerTwo = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const response = await fetch('/api/banners?active=true');
                if (response.ok) {
                    const data = await response.json();
                    setBanners(data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBanners();
    }, []);

    // Fallback banners if database is empty
    const fallbackBanners = [
        {
            id: '1',
            title: 'Mühendislik Ortağınız',
            subtitle: 'Lineer Hareket Sistemleri',
            imageUrl: '/assets/img/banner/banner-1.jpg',
            ctaLabel: 'Daha Fazlasını Keşfedin',
            ctaUrl: '/hakkimizda'
        },
        {
            id: '2',
            title: 'Ürün Seçimi ve CAD Desteği',
            subtitle: 'Proje Tasarımı',
            imageUrl: '/assets/img/banner/banner-2.jpg',
            ctaLabel: 'Hizmetlerimiz',
            ctaUrl: '/services'
        },
        {
            id: '3',
            title: 'Vidalı Krikolar Yön Değiştiriciler',
            subtitle: 'Mecmot Ürünleri',
            imageUrl: '/assets/img/banner/banner-3.jpg',
            ctaLabel: 'Ürün Portföyü',
            ctaUrl: '/portfolio/3-columns'
        }
    ];

    const displayBanners = banners.length > 0 ? banners : fallbackBanners;

    if (loading) {
        return null; // or a loading spinner
    }

  	return (
		<>
			<div className="banner__two">
				<Swiper
					thumbs={{ swiper: thumbsSwiper }}
					effect='fade'
					loop={displayBanners.length > 1}
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
				{displayBanners.map((banner) => (
					<SwiperSlide key={banner.id}>
						<div className="banner__two-area">	
							<div 
								className="banner__two-area-image" 
								style={{backgroundImage: `url(${banner.imageUrl})`}}
							></div>
							<div className="container">
								<div className="row align-items-center">
									<div className="col-xl-12">
										<div className="banner__two-content">
											{banner.subtitle && (
												<span className="subtitle">{banner.subtitle}</span>
											)}
											{banner.title && (() => {
												const words = banner.title.split(' ');
												if (words.length === 1) {
													return <h1>{banner.title}</h1>;
												} else {
													// İlk kelimeyi h2, geri kalanını h1 yap
													return (
														<>
															<h2>{words[0]}</h2>
															<h1>{words.slice(1).join(' ')}</h1>
														</>
													);
												}
											})()}
											{banner.ctaLabel && banner.ctaUrl && (
												<Link className="build_button" href={banner.ctaUrl}>
													{banner.ctaLabel}
													<i className="flaticon-right-up"></i>
												</Link>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
				</Swiper>
			</div>
			{displayBanners.length > 1 && (
				<div className="banner__two-slide">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="banner__two-slide-area">
									<div className="banner__two-slide-area-thumb dark_image">
										<Swiper
											onSwiper={setThumbsSwiper}
											slidesPerView={Math.min(3, displayBanners.length)}
											freeMode={true}
											watchSlidesProgress={true}
											autoplay={{
												delay: 4500,
												disableOnInteraction: false,
												reverseDirection: false,
											}}
											modules={[FreeMode, Thumbs, Autoplay]}
										>
											{displayBanners.map((banner) => (
												<SwiperSlide key={banner.id} className='banner__two-slide-area-thumb-item'>
													<img src={banner.imageUrl} alt={banner.title || 'banner'} />
													<h6>{banner.title || 'Banner'}</h6>
												</SwiperSlide>
											))}
										</Swiper>
									</div>
									<div className="banner__two-slide-area-arrow">
										<div className="banner__two-slide-area-arrow-prev banner_prev">
											<i className="fal fa-long-arrow-left"></i>
										</div>
										<div className="banner__two-slide-area-arrow-next banner_next">
											<i className="fal fa-long-arrow-right"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default BannerTwo;
