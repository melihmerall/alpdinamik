"use client"
import React, { useState, useEffect } from 'react';
import image1 from "../../../../public/assets/img/about/about-5.jpg";
import image2 from "../../../../public/assets/img/about/about-6.jpg";
import Count from '../../common/count';
import Link from "next/link";

const AboutFour = () => {
    // Fallback data
    const fallbackData = {
        subtitle: 'Hakkımızda',
        title: 'Lineer Hareket Sistemlerinde Güvenilir Çözüm Ortağınız',
        body: 'Alpdinamik, lineer hareket sistemleri konusunda projeci ve mühendislik odaklı bir firmadır. Temsil ettiğimiz Mecmot markasının ürünlerini sadece satış olarak değil; uygulama analizi, ürün seçimi ve boyutlandırma, CAD desteği, devreye alma ve satış sonrası hizmetlerle birlikte sunar.',
        imageUrl: image1.src,
        image2Url: image2.src,
        stat1Number: 25,
        stat1Label: 'Yıl Sektör Tecrübesi',
        stat2Number: 500,
        stat2Label: 'Endüstriyel Proje',
        stat3Number: 10,
        stat3Label: 'Farklı Uygulama Alanı',
        ctaLabel: 'Hikayemiz',
        ctaUrl: '/hakkimizda'
    };

    const [displayData, setDisplayData] = useState(fallbackData);

    useEffect(() => {
        let isMounted = true;

        async function fetchAboutData() {
            try {
                const response = await fetch('/api/company-pages?slug=home-about&fallback=true');
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted && data) {
                        const computedData = {
                            subtitle: data.subtitle || fallbackData.subtitle,
                            title: data.title || fallbackData.title,
                            body: data.body || fallbackData.body,
                            imageUrl: data.imageUrl || fallbackData.imageUrl,
                            image2Url: data.image2Url || fallbackData.image2Url,
                            stat1Number: data.stat1Number ?? fallbackData.stat1Number,
                            stat1Label: data.stat1Label || fallbackData.stat1Label,
                            stat2Number: data.stat2Number ?? fallbackData.stat2Number,
                            stat2Label: data.stat2Label || fallbackData.stat2Label,
                            stat3Number: data.stat3Number ?? fallbackData.stat3Number,
                            stat3Label: data.stat3Label || fallbackData.stat3Label,
                            ctaLabel: data.ctaLabel || fallbackData.ctaLabel,
                            ctaUrl: data.ctaUrl || fallbackData.ctaUrl,
                        };
                        setDisplayData(computedData);

                        if (computedData.imageUrl && !computedData.imageUrl.startsWith('http')) {
                            const link = document.createElement('link');
                            link.rel = 'preload';
                            link.as = 'image';
                            link.href = computedData.imageUrl;
                            document.head.appendChild(link);
                        }
                        if (computedData.image2Url && !computedData.image2Url.startsWith('http')) {
                            const link = document.createElement('link');
                            link.rel = 'preload';
                            link.as = 'image';
                            link.href = computedData.image2Url;
                            document.head.appendChild(link);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        }
        fetchAboutData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="about__four section-padding" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
            <div className="container">
                <div className="row al-center" style={{ marginBottom: '60px' }}>
                    <div className="col-lg-3 lg-mb-25">
                        <div className="about__four-left wow img_top_animation">
                            <img src={displayData.imageUrl || image1.src} alt={displayData.title || 'About'} />
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="about__four-title">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">{displayData.subtitle}</span>
                            <h2 className="mb-20 wow fadeInRight" data-wow-delay=".6s">
                                {(() => {
                                    const title = displayData.title || '';
                                    const words = title.split(' ');
                                    if (words.length > 1) {
                                        const firstWord = words[0];
                                        const restWords = words.slice(1).join(' ');
                                        return (
                                            <>
                                                {firstWord}
                                                <br />
                                                {restWords}
                                            </>
                                        );
                                    }
                                    return title;
                                })()}
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay=".4s">{displayData.body}</p>
                            {displayData.ctaLabel && displayData.ctaUrl && (
                                <div className="wow fadeInDown" data-wow-delay="1.2s">
                                    <Link className="build_button mt-25" href={displayData.ctaUrl}>
                                        {displayData.ctaLabel}<i className="flaticon-right-up"></i>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row mt-30" style={{ marginTop: '60px' }}>
                    <div className="col-lg-8">
                        <div className="about__four-counter">
                            <div className="row">
                                {displayData.stat1Number && displayData.stat1Label && (
                                    <div className="col-md-4 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
                                        <div className="about__four-counter-item">
                                            <div className="box">
                                                <h2><Count number={displayData.stat1Number}/>+</h2>
                                                <p>{displayData.stat1Label}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {displayData.stat2Number && displayData.stat2Label && (
                                    <div className="col-md-4 col-sm-6 wow fadeInUp" data-wow-delay=".7s">
                                        <div className="about__four-counter-item borders t-center md-t-left">
                                            <div className="box">
                                                <h2><Count number={displayData.stat2Number}/>+</h2>
                                                <p>{displayData.stat2Label}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {displayData.stat3Number && displayData.stat3Label && (
                                    <div className="col-md-4 col-sm-6 wow fadeInUp" data-wow-delay="1s">
                                        <div className="about__four-counter-item t-right md-t-left">
                                            <div className="box">
                                                <h2><Count number={displayData.stat3Number}/>+</h2>
                                                <p>{displayData.stat3Label}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 lg-mt-25">
                        <div className="about__four-right t-right wow img_right_animation">
                            <img src={displayData.image2Url || image2.src} alt={displayData.title || 'About'} />
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                /* About Four Responsive Styles */
                @media (max-width: 991px) {
                    .about__four {
                        padding-top: 60px !important;
                        padding-bottom: 60px !important;
                    }
                    .about__four-left {
                        margin-bottom: 40px;
                    }
                    .about__four-right {
                        text-align: center !important;
                    }
                    .about__four-right img {
                        max-width: 100%;
                        height: auto;
                    }
                }
                @media (max-width: 767px) {
                    .about__four {
                        padding-top: 40px !important;
                        padding-bottom: 40px !important;
                    }
                    .about__four-left h2 {
                        font-size: clamp(24px, 6vw, 36px) !important;
                        line-height: 1.3 !important;
                    }
                    .about__four-left .subtitle {
                        font-size: 14px !important;
                    }
                    .about__four-left p {
                        font-size: 15px !important;
                        line-height: 1.6 !important;
                    }
                    .about__four-stats {
                        flex-direction: column !important;
                        gap: 20px !important;
                    }
                    .about__four-stats-item {
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AboutFour;
