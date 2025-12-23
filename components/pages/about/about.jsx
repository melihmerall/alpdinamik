"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import image from "../../../public/assets/img/about/about-4.jpg";
import Count from "../common/count";

const whyChooseItems = [
    { title: "Mühendislik bakış açısı", description: "Ürün satmadan önce doğru çözümü konuşuruz." },
    { title: "Yerli üretici gücü", description: "Mecmot'un üretici mühendisliğini sahaya taşırız." },
    { title: "Doğru hesaplama, doğru ürün", description: "Uygulamaya özel mühendislik hesaplamaları ve ürün seçimi." },
    { title: "Anında teknik destek", description: "Hızlı geri dönüş, yerinde ve ulaşılabilir teknik ekip." },
    { title: "Satış sonrası da buradayız", description: "Proje devreye alındıktan sonra da destek devam eder." },
    { title: "Müşteri değil, çözüm ortağı", description: "İlişkiyi tedarik değil, uzun vadeli iş birliği olarak görürüz." },
    { title: "Güçlü satış ve saha ağı", description: "Projenin başından devreye almaya kadar yanınızdayız." },
    { title: "Hareketin olduğu her yerde", description: "Endüstriyel hareket varsa, çözüm de vardır." },
];

const AboutMain = ({ aboutData }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

        return () => {
            if (statsSection) {
                observer.unobserve(statsSection);
            }
        };
    }, []);

    // Use admin data if available, otherwise use default content
    const subtitle = aboutData?.subtitle || "Hakkımızda";
    const title = aboutData?.title || "Lineer Hareket Sistemlerinde Mühendislik Ortağınız";
    const body = aboutData?.body || "Alpdinamik, lineer hareket sistemleri konusunda projeci ve mühendislik odaklı bir firmadır. Temsil ettiğimiz markaların ürünlerini sadece satış olarak değil, uygulama analizi, ürün seçimi, CAD desteği ve devreye alma hizmetleriyle birlikte sunuyoruz. Makine imalatçıları, çelik endüstrisi, güneş enerjisi ve savunma sanayi gibi sektörlerde güvenilir çözüm ortağıyız.";
    const imageUrl = aboutData?.imageUrl || image.src;
    const ctaLabel = aboutData?.ctaLabel || "Projelerimizi İnceleyin";
    const ctaUrl = aboutData?.ctaUrl || "/portfolio/3-columns";
    const stat1Number = aboutData?.stat1Number || 25;
    const stat1Label = aboutData?.stat1Label || "Yıl Sektör Tecrübesi";
    const stat2Number = aboutData?.stat2Number || 500;
    const stat2Label = aboutData?.stat2Label || "Endüstriyel Proje";
    const stat3Number = aboutData?.stat3Number || 10;
    const stat3Label = aboutData?.stat3Label || "Farklı Uygulama Alanı";
    const missionSubtitle = aboutData?.missionSubtitle || "Misyonumuz";
    const missionTitle = aboutData?.missionTitle || "Doğru Ürün + Doğru Mühendislik + Sürdürülebilir Hizmet";
    const missionBody = aboutData?.missionBody || "Müşterilerimize en uygun ürünü seçmek, doğru mühendislik çözümleri sunmak ve sürdürülebilir hizmet anlayışıyla uzun vadeli ortaklıklar kurmak temel misyonumuzdur.";

    return (
        <>
            {/* Mission Section - Enhanced */}
            <div className="mission__area section-padding" style={{ background: 'var(--color-2)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 lg-mb-30">
                            <div className="mission__area-left mr-40 xl-mr-0">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s" style={{ 
                                    display: 'inline-block',
                                    marginBottom: '1rem'
                                }}>
                                    {missionSubtitle}
                                </span>
                                <h2 className="title_split_anim wow fadeInRight" data-wow-delay=".6s" style={{ 
                                    fontSize: '2.5rem',
                                    lineHeight: '1.2',
                                    marginBottom: '1.5rem',
                                    color: 'var(--text-heading-color)'
                                }}>
                                    {missionTitle}
                                </h2>
                                {missionBody && (
                                    <p className="wow fadeInUp" data-wow-delay=".8s" style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '1.8',
                                        color: 'var(--body-color)',
                                        maxWidth: '90%'
                                    }}>
                                        {missionBody}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mission__area-right">
                                <div className="row">
                                    <div className="col-md-6 md-mb-25 wow fadeInUp" data-wow-delay=".6s">
                                        <div className="experience__area-list-item" style={{
                                            background: 'var(--bg-white)',
                                            padding: '2rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            height: '100%',
                                            border: '1px solid var(--border-color-1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                                        }}
                                        >
                                            <i className="flaticon-team" style={{ 
                                                fontSize: '3rem', 
                                                color: 'var(--primary-color-1)',
                                                marginBottom: '1rem',
                                                display: 'block'
                                            }}></i>
                                            <div className="experience__area-list-item-content">
                                                <h4 style={{ 
                                                    fontSize: '1.25rem',
                                                    marginBottom: '0.75rem',
                                                    color: 'var(--text-heading-color)'
                                                }}>Proje Tasarımı</h4>
                                                <p style={{ 
                                                    color: 'var(--body-color)',
                                                    lineHeight: '1.6',
                                                    margin: 0
                                                }}>Uygulama analizi ve mühendislik danışmanlığı ile her detayı planlıyoruz</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 wow fadeInUp" data-wow-delay=".9s">
                                        <div className="experience__area-list-item" style={{
                                            background: 'var(--bg-white)',
                                            padding: '2rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            height: '100%',
                                            border: '1px solid var(--border-color-1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                                        }}
                                        >
                                            <i className="flaticon-technology" style={{ 
                                                fontSize: '3rem', 
                                                color: 'var(--primary-color-1)',
                                                marginBottom: '1rem',
                                                display: 'block'
                                            }}></i>
                                            <div className="experience__area-list-item-content">
                                                <h4 style={{ 
                                                    fontSize: '1.25rem',
                                                    marginBottom: '0.75rem',
                                                    color: 'var(--text-heading-color)'
                                                }}>CAD & Teknik Veri</h4>
                                                <p style={{ 
                                                    color: 'var(--body-color)',
                                                    lineHeight: '1.6',
                                                    margin: 0
                                                }}>2D/3D CAD desteği ve teknik veri hazırlığında kalite odaklıyız</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section - New Professional Design */}
            <div id="stats-section" className="section-padding" style={{ 
                background: 'linear-gradient(135deg, var(--primary-color-1) 0%, var(--color-4) 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 0
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-30">
                            <div className="text-center wow fadeInUp" data-wow-delay=".3s" style={{
                                padding: '2.5rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            >
                                <h2 style={{ 
                                    fontSize: '3.5rem',
                                    fontWeight: '700',
                                    color: 'var(--text-white)',
                                    marginBottom: '0.5rem',
                                    lineHeight: '1'
                                }}>
                                    {isVisible && <Count number={stat1Number} />}+
                                </h2>
                                <p style={{ 
                                    fontSize: '1.1rem',
                                    color: 'var(--text-white)',
                                    margin: 0,
                                    fontWeight: '500',
                                    opacity: 0.95
                                }}>
                                    {stat1Label}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-30">
                            <div className="text-center wow fadeInUp" data-wow-delay=".5s" style={{
                                padding: '2.5rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            >
                                <h2 style={{ 
                                    fontSize: '3.5rem',
                                    fontWeight: '700',
                                    color: 'var(--text-white)',
                                    marginBottom: '0.5rem',
                                    lineHeight: '1'
                                }}>
                                    {isVisible && <Count number={stat2Number} />}+
                                </h2>
                                <p style={{ 
                                    fontSize: '1.1rem',
                                    color: 'var(--text-white)',
                                    margin: 0,
                                    fontWeight: '500',
                                    opacity: 0.95
                                }}>
                                    {stat2Label}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 mb-30">
                            <div className="text-center wow fadeInUp" data-wow-delay=".7s" style={{
                                padding: '2.5rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            >
                                <h2 style={{ 
                                    fontSize: '3.5rem',
                                    fontWeight: '700',
                                    color: 'var(--text-white)',
                                    marginBottom: '0.5rem',
                                    lineHeight: '1'
                                }}>
                                    {isVisible && <Count number={stat3Number} />}+
                                </h2>
                                <p style={{ 
                                    fontSize: '1.1rem',
                                    color: 'var(--text-white)',
                                    margin: 0,
                                    fontWeight: '500',
                                    opacity: 0.95
                                }}>
                                    {stat3Label}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section - Enhanced */}
            <div className="about__five section-padding pt-0">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-lg-5 lg-mb-30">
                            <div className="about__five-image wow img_left_animation" style={{
                                position: 'relative',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
                            }}>
                                <img 
                                    src={imageUrl} 
                                    alt="image" 
                                    style={{
                                        width: '100%',
                                        maxWidth: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        transition: 'transform 0.5s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="about__five-right ml-70 xl-ml-0">
                                <div className="about__five-right-title">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s" style={{
                                        display: 'inline-block',
                                        marginBottom: '1rem'
                                    }}>
                                        {subtitle}
                                    </span>
                                    <h2 className="title_split_anim wow fadeInRight" data-wow-delay=".6s" style={{
                                        fontSize: '2.5rem',
                                        lineHeight: '1.3',
                                        marginBottom: '1.5rem',
                                        color: 'var(--text-heading-color)'
                                    }}>
                                        {title}
                                    </h2>
                                </div>
                                <div 
                                    className="wow fadeInUp" 
                                    data-wow-delay=".8s"
                                    style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '1.8',
                                        color: 'var(--body-color)',
                                        marginBottom: '2rem'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, '<br />') }}
                                />
                                {ctaLabel && ctaUrl && (
                                    <div className="item_bounce wow fadeInDown" data-wow-delay="1s">
                                        <Link 
                                            className="build_button mt-20" 
                                            href={ctaUrl}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 191, 67, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            {ctaLabel}
                                            <i className="flaticon-right-up"></i>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Section */}
            <section className="why-choose section-padding pt-0">
                <div className="container">
                    <div className="why-choose__head">
                        <div>
                            <span>Neden Alpdinamik?</span>
                            <h3>Çünkü aynı masada sadece proje konuşuruz</h3>
                        </div>
                        <p>
                            Mühendislikten gelen refleksimizle, satıştan önce ihtiyaçları doğru okumaya
                            odaklanır, üreticinin gücünü sahaya taşırken projeyi sonuna kadar sahipleniriz.
                        </p>
                    </div>
                    <div className="why-choose__grid">
                        {whyChooseItems.map((item, index) => (
                            <article key={item.title} className="why-choose__card">
                                <div className="why-choose__badge">{index + 1}</div>
                                <div>
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutMain;
