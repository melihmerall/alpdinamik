"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";

const BannerFour = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentBlocks, setContentBlocks] = useState(null);

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
                        // Video preload is not recommended - browser handles it better
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

    // Get first banner or use content blocks
    const firstBanner = banners.length > 0 ? banners[0] : null;
    const subtitle = firstBanner?.subtitle || '';
    const bannerTitle = firstBanner?.title || '';
    const title1 = bannerTitle ? bannerTitle.split(' ')[0] : '';
    const title2 = bannerTitle ? bannerTitle.split(' ').slice(1).join(' ') : '';
    const ctaLabel = firstBanner?.ctaLabel || contentBlocks?.home_hero_cta_primary?.body || 'Projenizi Paylaşın';
    const ctaUrl = firstBanner?.ctaUrl || '/#iletisim';

    // Show fallback content even while loading
    // if (loading) {
    //     return null;
    // }

    // Video URL'ini hazırla (zaman aralığı ekle)
    const getVideoUrl = (url) => {
        if (!url) return null;
        // Eğer URL'de zaten #t varsa, olduğu gibi döndür
        if (url.includes('#t=')) return url;
        // Varsayılan olarak #t=1,200 ekle (1. saniyeden 200. saniyeye)
        return `${url}#t=1,200`;
    };

    const videoUrl = firstBanner?.videoUrl || (!firstBanner?.imageUrl ? 'https://html.nextwpcook.com/buildgo/assets/img/banner/banner.mp4' : null);
    const finalVideoUrl = videoUrl ? getVideoUrl(videoUrl) : null;

    return (
        <div className="banner__four" style={{ 
            position: 'relative', 
            padding: '0 !important',
            paddingTop: '0 !important',
            paddingBottom: '0 !important',
            minHeight: '130vh !important', 
            height: '130vh !important',
            overflow: 'hidden'
        }}>
            <div 
                className="bg-video" 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '110vh',
                    minHeight: '110vh',
                    zIndex: -1,
                    backgroundImage: finalVideoUrl ? 'none' : (firstBanner?.imageUrl ? `url(${firstBanner.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.75)'
                }}
            >
                {!finalVideoUrl && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        zIndex: 1
                    }}></div>
                )}
                {finalVideoUrl && (
                    <div className="elementor-background-video-container" aria-hidden="true" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '110vh',
                        minHeight: '110vh',
                        overflow: 'hidden',
                        zIndex: 0
                    }}>
                        <video 
                            className="elementor-background-video-hosted"
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            src={finalVideoUrl}
                            style={{ 
                                width: '100%', 
                                height: '110vh',
                                minHeight: '110vh',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            zIndex: 2
                        }}></div>
                    </div>
                )}
            </div>
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="banner__four-content">
                            {subtitle && (
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".3s">{subtitle}</span>
                            )}
                            {title1 && (
                                <h1 className="wow fadeInRight" data-wow-delay=".6s">{title1}</h1>
                            )}
                            {title2 && (
                                <h2 className="wow fadeInRight" data-wow-delay=".9s">{title2}</h2>
                            )}
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link 
                                    className="build_button" 
                                    href={ctaUrl}
                                    onClick={(e) => {
                                        if (ctaUrl === '/#iletisim') {
                                            e.preventDefault();
                                            const element = document.getElementById('iletisim');
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        }
                                    }}
                                >
                                    {ctaLabel}<i className="flaticon-right-up"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                /* Banner Four Full Viewport Height - Override SCSS */
                .banner__four {
                    padding: 0 !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    min-height: 130vh !important;
                    height: 130vh !important;
                    display: flex !important;
                    align-items: center !important;
                    overflow: hidden !important;
                }
                .banner__four .bg-video {
                    min-height: 110vh !important;
                    height: 110vh !important;
                }
                .banner__four .elementor-background-video-container {
                    min-height: 110vh !important;
                    height: 110vh !important;
                }
                .banner__four .elementor-background-video-hosted {
                    min-height: 110vh !important;
                    height: 110vh !important;
                }
                .banner__four-content {
                    padding: 80px 0 !important;
                }
                .banner__four-content h1 {
                    font-size: clamp(48px, 6vw, 86px);
                    line-height: 1.1;
                    margin-bottom: 10px;
                }
                .banner__four-content h2 {
                    font-size: clamp(32px, 4.5vw, 56px);
                    line-height: 1.15;
                    font-weight: 500;
                }
                /* Banner Four Responsive Styles */
                @media (max-width: 991px) {
                    .banner__four {
                        min-height: 120vh !important;
                        height: 120vh !important;
                    }
                    .banner__four .bg-video {
                        min-height: 110vh !important;
                        height: 110vh !important;
                    }
                    .banner__four .elementor-background-video-container {
                        min-height: 110vh !important;
                        height: 110vh !important;
                    }
                    .banner__four .elementor-background-video-hosted {
                        min-height: 110vh !important;
                        height: 110vh !important;
                    }
                }
                @media (max-width: 767px) {
                    .banner__four {
                        min-height: 110vh !important;
                        height: 110vh !important;
                    }
                    .banner__four .bg-video {
                        min-height: 105vh !important;
                        height: 105vh !important;
                    }
                    .banner__four .elementor-background-video-container {
                        min-height: 105vh !important;
                        height: 105vh !important;
                    }
                    .banner__four .elementor-background-video-hosted {
                        min-height: 105vh !important;
                        height: 105vh !important;
                    }
                    .banner__four-content {
                        padding: 40px 20px !important;
                    }
                    .banner__four-content h1,
                    .banner__four-content h2 {
                        font-size: clamp(28px, 8vw, 48px) !important;
                        line-height: 1.2 !important;
                    }
                    .banner__four-content .subtitle {
                        font-size: 14px !important;
                    }
                    .banner__four-content .build_button {
                        padding: 12px 24px !important;
                        font-size: 14px !important;
                    }
                }
                @media (max-width: 575px) {
                    .banner__four {
                        min-height: 100vh !important;
                        height: 100vh !important;
                    }
                    .banner__four .bg-video {
                        min-height: 100vh !important;
                        height: 100vh !important;
                    }
                    .banner__four .elementor-background-video-container {
                        min-height: 100vh !important;
                        height: 100vh !important;
                    }
                    .banner__four .elementor-background-video-hosted {
                        min-height: 100vh !important;
                        height: 100vh !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BannerFour;

