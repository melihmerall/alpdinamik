"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const BannerFour = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentBlocks, setContentBlocks] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const videoRefs = useRef({});
    // Video biten slide'ları takip et (video bitince görsel gösterilecek)
    const [videoEndedSlides, setVideoEndedSlides] = useState(new Set());

    useEffect(() => {
        async function fetchData() {
            try {
                // Paralel API çağrıları - çok daha hızlı
                const [bannerResponse, contentResponse] = await Promise.all([
                    fetch('/api/banners?active=true'),
                    fetch('/api/content-blocks')
                ]);

                // Banners
                if (bannerResponse.ok) {
                    const bannerData = await bannerResponse.json();
                    setBanners(bannerData);
                    
                    // Preload first banner image (only local)
                    if (bannerData && bannerData.length > 0) {
                        const firstBanner = bannerData[0];
                        if (firstBanner.imageUrl && !firstBanner.imageUrl.startsWith('http')) {
                            const link = document.createElement('link');
                            link.rel = 'preload';
                            link.as = 'image';
                            link.href = firstBanner.imageUrl;
                            document.head.appendChild(link);
                        }
                    }
                }

                // Content blocks
                if (contentResponse.ok) {
                    const contentData = await contentResponse.json();
                    const blocks = {};
                    contentData.forEach(block => {
                        blocks[block.key] = block;
                    });
                    setContentBlocks(blocks);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Video kontrolü - sadece aktif slide'daki video oynat
    useEffect(() => {
        Object.keys(videoRefs.current).forEach((key) => {
            const video = videoRefs.current[key];
            if (video) {
                const slideIndex = parseInt(key);
                if (slideIndex === activeIndex) {
                    // Eğer video daha önce bitmişse tekrar oynatma, görsel göster
                    if (!videoEndedSlides.has(slideIndex)) {
                        video.play().catch(() => {});
                    } else {
                        // Video bitmişse durdur
                        video.pause();
                    }
                } else {
                    video.pause();
                }
            }
        });
    }, [activeIndex, videoEndedSlides]);

    // Video bitince görseli göster
    const handleVideoEnded = (slideIndex) => {
        setVideoEndedSlides(prev => new Set(prev).add(slideIndex));
    };

    // Fallback banner
    const fallbackBanner = {
        id: 'fallback',
        subtitle: contentBlocks?.home_hero_subtitle?.body || 'Mühendislik çözümleri',
        title: contentBlocks?.home_hero_title?.body || 'Projelerinize değer katıyoruz',
        description: contentBlocks?.home_hero_description?.body || '',
        ctaLabel: contentBlocks?.home_hero_cta_primary?.body || 'Projenizi Paylaşın',
        ctaUrl: '/#iletisim',
        imageUrl: '/assets/img/banner/banner-1.jpg'
    };

    // Aktif banner'ları kullan, yoksa fallback
    const slides = banners.length > 0 ? banners : (loading ? [] : [fallbackBanner]);

    // Video URL'ini hazırla
    const getVideoUrl = (url) => {
        if (!url) return null;
        if (url.includes('#t=')) return url;
        return `${url}#t=1,200`;
    };

    const handleCtaClick = (ctaUrl, e) => {
        if (ctaUrl === '/#iletisim') {
            e.preventDefault();
            const element = document.getElementById('iletisim');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (!slides.length) {
        return null;
    }

    return (
        <div className="banner__four-slider">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade, Navigation]}
                effect="fade"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false
                }}
                loop={slides.length > 1}
                speed={1000}
                pagination={slides.length > 1 ? {
                    clickable: true,
                    dynamicBullets: false
                } : false}
                navigation={slides.length > 1 ? {
                    nextEl: '.banner__four-nav-next',
                    prevEl: '.banner__four-nav-prev',
                } : false}
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex);
                }}
                className="banner__four-swiper"
            >
                {slides.map((banner, index) => {
                    const words = banner?.title?.trim()?.split(' ') || [];
                    const title1 = words.length > 1 ? words[0] : (banner?.title || 'AlpDinamik');
                    const title2 = words.length > 1 ? words.slice(1).join(' ') : (banner?.title ? '' : 'Endüstriyel çözümler');
                    const finalVideoUrl = banner?.videoUrl ? getVideoUrl(banner.videoUrl) : null;
                    const hasVideo = Boolean(finalVideoUrl);
                    // Video bitmişse görsel göster
                    const showImageAfterVideo = hasVideo && videoEndedSlides.has(index);
                    const shouldShowVideo = hasVideo && !showImageAfterVideo;

                    return (
                        <SwiperSlide key={banner.id || `banner-${index}`}>
                            <div className="banner__four">
                                <div className="banner__four-media">
                                    {/* Video bitmişse veya video yoksa görsel göster */}
                                    {(showImageAfterVideo || (!hasVideo && banner?.imageUrl)) && (
                                        <img
                                            src={banner.imageUrl}
                                            alt={banner?.title || 'Banner'}
                                            className="banner__four-media-image"
                                            loading={index <= 1 ? 'eager' : 'lazy'}
                                        />
                                    )}
                                    {/* Video göster (henüz bitmemişse) */}
                                    {shouldShowVideo && (
                                        <div className="elementor-background-video-container" aria-hidden="true">
                                            <video
                                                ref={(el) => {
                                                    if (el) videoRefs.current[index] = el;
                                                }}
                                                className="elementor-background-video-hosted"
                                                autoPlay={index === activeIndex && index === 0}
                                                muted
                                                loop={false}
                                                playsInline
                                                src={finalVideoUrl}
                                                preload={index <= 1 ? 'auto' : 'metadata'}
                                                onEnded={() => handleVideoEnded(index)}
                                            />
                                            <div className="banner__four-overlay"></div>
                                        </div>
                                    )}
                                    {/* Fallback - ne video ne görsel yoksa */}
                                    {!hasVideo && !banner?.imageUrl && (
                                        <div
                                            className="banner__four-media-fallback"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(6, 9, 20, 0.9) 0%, rgba(6, 9, 20, 0.8) 100%)'
                                            }}
                                        ></div>
                                    )}
                                    <div className="banner__four-overlay"></div>
                                </div>
                                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="banner__four-content">
                                                {banner?.subtitle && (
                                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".2s">
                                                        {banner.subtitle}
                                                    </span>
                                                )}
                                                {title1 && (
                                                    <h1 className="wow fadeInRight" data-wow-delay=".4s">
                                                        {title1}
                                                    </h1>
                                                )}
                                                {title2 && (
                                                    <h2 className="wow fadeInRight" data-wow-delay=".6s">
                                                        {title2}
                                                    </h2>
                                                )}
                                                {banner?.description && (
                                                    <p className="wow fadeInUp" data-wow-delay=".8s">
                                                        {banner.description}
                                                    </p>
                                                )}
                                                <div className="wow fadeInDown" data-wow-delay="1s">
                                                    <Link
                                                        className="build_button"
                                                        href={banner?.ctaUrl || '/#iletisim'}
                                                        onClick={(e) => handleCtaClick(banner?.ctaUrl || '/#iletisim', e)}
                                                    >
                                                        {banner?.ctaLabel || 'Projenizi Paylaşın'}
                                                        <i className="flaticon-right-up"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            {/* Navigation Arrows - Sadece 1'den fazla slide varsa göster */}
            {slides.length > 1 && (
                <>
                    <button className="banner__four-nav-prev" aria-label="Önceki slide">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button className="banner__four-nav-next" aria-label="Sonraki slide">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </>
            )}
            <style jsx global>{`
                .banner__four-slider {
                    position: relative;
                    min-height: 110vh;
                    height: 110vh;
                    background: #050913;
                }
                .banner__four-swiper {
                    width: 100% !important;
                    height: 100% !important;
                    min-height: 110vh !important;
                }
                .banner__four-swiper .swiper-wrapper {
                    height: 100% !important;
                    min-height: 110vh !important;
                }
                .banner__four-swiper .swiper-slide {
                    height: 100% !important;
                    min-height: 110vh !important;
                    position: relative !important;
                    width: 100% !important;
                }
                .banner__four {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    min-height: 110vh;
                    background: #050913;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                }
                .banner__four-media {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    min-height: 110vh;
                    background-color: #050913;
                    z-index: 0;
                }
                .banner__four-media-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    min-height: 110vh;
                    object-fit: cover;
                    object-position: center;
                    filter: brightness(0.75);
                }
                .banner__four .elementor-background-video-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    min-height: 110vh;
                    overflow: hidden;
                    z-index: 0;
                }
                .banner__four .elementor-background-video-container.video-ended {
                    display: none;
                }
                .banner__four .elementor-background-video-hosted {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    min-height: 110vh;
                    object-fit: cover;
                    object-position: center;
                }
                .banner__four-media-fallback {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    min-height: 110vh;
                }
                .banner__four-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    min-height: 110vh;
                    background: rgba(0, 0, 0, 0.25);
                    z-index: 1;
                }
                .banner__four-content {
                    padding: clamp(40px, 8vw, 120px) 0;
                    position: relative;
                    z-index: 10;
                    width: 100%;
                }
                .banner__four-content h1 {
                    font-size: clamp(42px, 6vw, 90px);
                    line-height: 1.05;
                    margin-bottom: 10px;
                }
                .banner__four-content h2 {
                    font-size: clamp(32px, 4vw, 58px);
                    font-weight: 400;
                }
                .banner__four-content p {
                    max-width: 520px;
                    margin-top: 16px;
                    margin-bottom: 24px;
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 1rem;
                    line-height: 1.7;
                }
                .banner__four-slider .swiper-pagination-bullets {
                    bottom: 30px !important;
                }
                .banner__four-slider .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.6);
                    opacity: 1;
                }
                .banner__four-slider .swiper-pagination-bullet-active {
                    background: #fff;
                }
                /* Navigation Arrows */
                .banner__four-nav-prev,
                .banner__four-nav-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    min-height: 40px;
                    background: rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 50%;
                    color: #fff;
                    cursor: pointer;
                    z-index: 20;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.75;
                    padding: 0;
                }
                .banner__four-nav-prev:hover,
                .banner__four-nav-next:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.35);
                    opacity: 1;
                    transform: translateY(-50%) scale(1.08);
                }
                .banner__four-nav-prev:active,
                .banner__four-nav-next:active {
                    transform: translateY(-50%) scale(0.96);
                }
                .banner__four-nav-prev {
                    left: 25px;
                }
                .banner__four-nav-next {
                    right: 25px;
                }
                .banner__four-nav-prev svg,
                .banner__four-nav-next svg {
                    width: 16px;
                    height: 16px;
                    transition: transform 0.3s ease;
                }
                .banner__four-nav-prev:hover svg,
                .banner__four-nav-next:hover svg {
                    transform: scale(1.1);
                }
                .banner__four-nav-prev.swiper-button-disabled,
                .banner__four-nav-next.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .banner__four-nav-prev.swiper-button-disabled:hover,
                .banner__four-nav-next.swiper-button-disabled:hover {
                    transform: translateY(-50%) scale(1);
                    background: rgba(255, 255, 255, 0.15);
                }
                @media (max-width: 991px) {
                    .banner__four-nav-prev,
                    .banner__four-nav-next {
                        width: 36px;
                        height: 36px;
                        min-width: 36px;
                        min-height: 36px;
                    }
                    .banner__four-nav-prev {
                        left: 18px;
                    }
                    .banner__four-nav-next {
                        right: 18px;
                    }
                    .banner__four-nav-prev svg,
                    .banner__four-nav-next svg {
                        width: 14px;
                        height: 14px;
                    }
                }
                @media (max-width: 767px) {
                    .banner__four-nav-prev,
                    .banner__four-nav-next {
                        width: 32px;
                        height: 32px;
                        min-width: 32px;
                        min-height: 32px;
                    }
                    .banner__four-nav-prev {
                        left: 12px;
                    }
                    .banner__four-nav-next {
                        right: 12px;
                    }
                    .banner__four-nav-prev svg,
                    .banner__four-nav-next svg {
                        width: 12px;
                        height: 12px;
                    }
                }
                @media (max-width: 575px) {
                    .banner__four-nav-prev,
                    .banner__four-nav-next {
                        width: 28px;
                        height: 28px;
                        min-width: 28px;
                        min-height: 28px;
                    }
                    .banner__four-nav-prev {
                        left: 10px;
                    }
                    .banner__four-nav-next {
                        right: 10px;
                    }
                    .banner__four-nav-prev svg,
                    .banner__four-nav-next svg {
                        width: 11px;
                        height: 11px;
                    }
                }
                @media (max-width: 991px) {
                    .banner__four-slider,
                    .banner__four-swiper,
                    .banner__four-swiper .swiper-wrapper,
                    .banner__four-swiper .swiper-slide,
                    .banner__four,
                    .banner__four-media,
                    .banner__four-media-image,
                    .banner__four .elementor-background-video-container,
                    .banner__four .elementor-background-video-hosted,
                    .banner__four-media-fallback,
                    .banner__four-overlay {
                        min-height: 100vh;
                    }
                }
                @media (max-width: 767px) {
                    .banner__four-slider,
                    .banner__four-swiper,
                    .banner__four-swiper .swiper-wrapper,
                    .banner__four-swiper .swiper-slide,
                    .banner__four,
                    .banner__four-media,
                    .banner__four-media-image,
                    .banner__four .elementor-background-video-container,
                    .banner__four .elementor-background-video-hosted,
                    .banner__four-media-fallback,
                    .banner__four-overlay {
                        min-height: 90vh;
                    }
                    .banner__four-content {
                        padding: 40px 20px;
                    }
                    .banner__four-content h1,
                    .banner__four-content h2 {
                        font-size: clamp(28px, 8vw, 48px);
                        line-height: 1.2;
                    }
                }
                @media (max-width: 575px) {
                    .banner__four-slider,
                    .banner__four-swiper,
                    .banner__four-swiper .swiper-wrapper,
                    .banner__four-swiper .swiper-slide,
                    .banner__four,
                    .banner__four-media,
                    .banner__four-media-image,
                    .banner__four .elementor-background-video-container,
                    .banner__four .elementor-background-video-hosted,
                    .banner__four-media-fallback,
                    .banner__four-overlay {
                        min-height: 85vh;
                    }
                }
            `}</style>
        </div>
    );
};

export default BannerFour;

