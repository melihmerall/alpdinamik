"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";

const BannerFour = () => {
    const [banners, setBanners] = useState([]);
    const [representatives, setRepresentatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentBlocks, setContentBlocks] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Paralel API çağrıları - çok daha hızlı
                const [bannerResponse, representativesResponse, contentResponse] = await Promise.all([
                    fetch('/api/banners?active=true'),
                    fetch('/api/representatives'),
                    fetch('/api/content-blocks')
                ]);

                // Banners
                if (bannerResponse.ok) {
                    const bannerData = await bannerResponse.json();
                    setBanners(bannerData);
                }

                // Representatives
                if (representativesResponse.ok) {
                    const representativesData = await representativesResponse.json();
                    // Filter active representatives and those with logos
                    const activeReps = representativesData.filter(rep => rep.isActive && rep.logoUrl);
                    // Remove duplicates by slug or name
                    const uniqueReps = activeReps.reduce((acc, rep) => {
                        const exists = acc.find(r => r.slug === rep.slug || r.name === rep.name);
                        if (!exists) {
                            acc.push(rep);
                        }
                        return acc;
                    }, []);
                    setRepresentatives(uniqueReps);
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

    if (loading) {
        return null;
    }

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
        <div className="banner__four">
            <div 
                className="bg-video" 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    backgroundImage: finalVideoUrl ? 'none' : (firstBanner?.imageUrl ? `url(${firstBanner.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {finalVideoUrl && (
                    <div className="elementor-background-video-container" aria-hidden="true" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
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
                                height: '100%', 
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
            {/* Brand slider - Representatives logos */}
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row" style={{ margin: 0 }}>
                    <div className="col-xl-12" style={{ padding: 0 }}>
                        <div className="banner__four-brand" style={{ 
                            marginTop: '150px',
                            background: 'var(--color-2)',
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            height: '196px',
                            flexDirection: 'row'
                        }}>
                            <div className="col-xl-3 col-lg-4 col-md-12 col-sm-12" style={{ 
                                padding: '0 40px 0 60px',
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                flexShrink: 0,
                                justifyContent: 'center'
                            }}>
                                <h5 style={{ 
                                    margin: 0,
                                    fontWeight: 600,
                                    color: 'var(--text-heading-color)',
                                    whiteSpace: 'nowrap',
                                    fontSize: 'clamp(16px, 2.5vw, 20px)'
                                }}>
                                Güvenilir Ortaklarımız
                                </h5>
                            </div>
                            <div className="col-xl-9 col-lg-8 col-md-12 col-sm-12" style={{ 
                                padding: 0,
                                flex: 1,
                                overflow: 'hidden',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <div className="scroll__slider" style={{ 
                                    padding: '0',
                                    background: 'var(--color-2)',
                                    borderLeft: '1px solid var(--border-color-2)',
                                    marginRight: '-260px',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                    <div className="text-slide" style={{ marginLeft: '40px', height: '100%', display: 'flex', alignItems: 'center', width: 'max-content' }}>
                                    <div className="sliders text_scroll" style={{ flexShrink: 0, animation: 'scroll 12s linear infinite', animationDirection: 'reverse' }}>
                                        <ul style={{ display: 'flex', padding: 0, margin: 0, listStyle: 'none' }}>
                                            {representatives.length > 0 ? (
                                                representatives.map((rep, index) => (
                                                    <li key={rep.id || index} style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a 
                                                            href={rep.websiteUrl || '#'} 
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img 
                                                                    decoding="async"
                                                                    src={rep.logoUrl || '/assets/img/brand/brand-1.png'} 
                                                                    alt={rep.name || 'Temsilcilik'}
                                                                    style={{ 
                                                                        maxWidth: '120px',
                                                                        height: 'auto',
                                                                        maxHeight: '50px',
                                                                        objectFit: 'contain',
                                                                        filter: 'none'
                                                                    }}
                                                                />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                ))
                                            ) : (
                                                <>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-1.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-2.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-3.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-4.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="sliders text_scroll" style={{ flexShrink: 0, animation: 'scroll 12s linear infinite', animationDirection: 'reverse' }}>
                                        <ul style={{ display: 'flex', padding: 0, margin: 0, listStyle: 'none' }}>
                                            {representatives.length > 0 ? (
                                                representatives.map((rep, index) => (
                                                    <li key={`duplicate-${rep.id || index}`} style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a 
                                                            href={rep.websiteUrl || '#'} 
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img 
                                                                    decoding="async"
                                                                    src={rep.logoUrl || '/assets/img/brand/brand-1.png'} 
                                                                    alt={rep.name || 'Temsilcilik'}
                                                                    style={{ 
                                                                        maxWidth: '120px',
                                                                        height: 'auto',
                                                                        maxHeight: '50px',
                                                                        objectFit: 'contain',
                                                                        filter: 'none'
                                                                    }}
                                                                />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                ))
                                            ) : (
                                                <>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-1.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-2.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-3.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                    <li style={{ display: 'inline-flex', margin: '0 50px' }}>
                                                        <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                                                            <div style={{
                                                                background: 'rgba(255, 255, 255, 0.95)',
                                                                padding: '15px 25px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                minHeight: '80px',
                                                                minWidth: '150px'
                                                            }}>
                                                                <img decoding="async" src="/assets/img/brand/brand-4.png" alt="image" style={{ maxWidth: '120px', height: 'auto', maxHeight: '50px', objectFit: 'contain', filter: 'none' }} />
                                                            </div>
                                                            <h6 className="t-center" style={{ margin: 0, display: 'none' }}></h6>
                                                        </a>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                /* Banner Four Responsive Styles */
                @media (max-width: 1199px) {
                    .banner__four-brand {
                        margin-top: 100px !important;
                        height: auto !important;
                        min-height: 150px !important;
                        flex-direction: column !important;
                    }
                    .banner__four-brand .col-xl-3,
                    .banner__four-brand .col-lg-4 {
                        padding: 20px !important;
                        width: 100% !important;
                        text-align: center !important;
                        border-bottom: 1px solid var(--border-color-2) !important;
                    }
                    .banner__four-brand .col-xl-9,
                    .banner__four-brand .col-lg-8 {
                        width: 100% !important;
                        padding: 20px 0 !important;
                    }
                    .scroll__slider {
                        margin-right: 0 !important;
                        border-left: none !important;
                    }
                    .text-slide {
                        margin-left: 20px !important;
                    }
                    .text-slide li {
                        margin: 0 30px !important;
                    }
                    .text-slide li div {
                        min-width: 120px !important;
                        padding: 12px 20px !important;
                        min-height: 70px !important;
                    }
                    .text-slide li img {
                        max-width: 100px !important;
                        max-height: 45px !important;
                    }
                }
                @media (max-width: 767px) {
                    .banner__four-brand {
                        margin-top: 80px !important;
                        min-height: 120px !important;
                    }
                    .banner__four-brand .col-xl-3,
                    .banner__four-brand .col-lg-4 {
                        padding: 15px !important;
                    }
                    .banner__four-brand h5 {
                        font-size: 16px !important;
                        white-space: normal !important;
                    }
                    .text-slide {
                        margin-left: 15px !important;
                    }
                    .text-slide li {
                        margin: 0 20px !important;
                    }
                    .text-slide li div {
                        min-width: 100px !important;
                        padding: 10px 15px !important;
                        min-height: 60px !important;
                    }
                    .text-slide li img {
                        max-width: 80px !important;
                        max-height: 40px !important;
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
                    .banner__four-brand {
                        margin-top: 60px !important;
                        min-height: 100px !important;
                    }
                    .banner__four-brand .col-xl-3,
                    .banner__four-brand .col-lg-4 {
                        padding: 12px !important;
                    }
                    .banner__four-brand h5 {
                        font-size: 14px !important;
                    }
                    .text-slide {
                        margin-left: 10px !important;
                    }
                    .text-slide li {
                        margin: 0 15px !important;
                    }
                    .text-slide li div {
                        min-width: 90px !important;
                        padding: 8px 12px !important;
                        min-height: 55px !important;
                    }
                    .text-slide li img {
                        max-width: 70px !important;
                        max-height: 35px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BannerFour;

