"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import logo from "../../../public/assets/img/logo-2.png";
import Social from "@/components/data/social";

const FooterOne = () => {
    const [siteSettings, setSiteSettings] = useState(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/site-settings');
                if (response.ok) {
                    const data = await response.json();
                    setSiteSettings(data);
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
            }
        }
        fetchSettings();
    }, []);

    return (
        <>
            <div className="footer__one" style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                paddingTop: '80px',
                paddingBottom: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(0, 123, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 193, 7, 0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="footer__one-cta" style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '40px',
                                marginBottom: '60px',
                                transition: 'all 0.3s ease'
                            }}>
                                <div className="row al-center">
                                    <div className="col-lg-8 lg-t-center lg-mb-25">
                                        <div className="footer__one-cta-title title_split_anim">
                                            <h2 style={{
                                                color: '#ffffff',
                                                fontSize: 'clamp(24px, 3vw, 36px)',
                                                fontWeight: '700',
                                                lineHeight: '1.3',
                                                margin: 0
                                            }}>Projenizi Paylaşın — Mühendislik Çözümümüzle Tanışın!</h2>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="footer__one-cta-icon t-right lg-t-center wow fadeInDown" data-wow-delay="1.2s">
                                            <Link href="/iletisim" style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '70px',
                                                height: '70px',
                                                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                                                borderRadius: '50%',
                                                color: '#ffffff',
                                                fontSize: '24px',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.1)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
                                            }}
                                            >
                                                <i className="flaticon-right-up"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="footer__one-area">
                                <div className="row">
                                    <div className="col-lg-4 col-sm-6">
                                        <div className="footer__one-widget mr-40" style={{ marginBottom: '40px' }}>
                                            <Link className="logo" href="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
                                                <img src={logo.src} alt="logo" style={{ maxHeight: '50px', filter: 'brightness(0) invert(1)' }} />
                                            </Link>
                                            <h5 style={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                fontSize: '16px',
                                                lineHeight: '1.6',
                                                fontWeight: '400',
                                                marginTop: '15px'
                                            }}>Lineer hareket sistemlerinde mühendislik çözümleri</h5>
                                            <div style={{ marginTop: '25px' }}>
                                                <Social />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 sm-mt-30">
                                        <div className="footer__one-widget address" style={{ marginBottom: '40px' }}>
                                            <h4 style={{
                                                color: '#ffffff',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                marginBottom: '25px',
                                                position: 'relative',
                                                paddingBottom: '15px'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    width: '50px',
                                                    height: '3px',
                                                    background: 'linear-gradient(90deg, #007bff, #0056b3)',
                                                    borderRadius: '2px'
                                                }}></span>
                                                İletişim
                                            </h4>
                                            <div className="footer__one-widget-address">
                                                {siteSettings?.address ? (
                                                    <h6 style={{
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        fontSize: '15px',
                                                        marginBottom: '15px',
                                                        lineHeight: '1.6'
                                                    }}>
                                                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`} 
                                                            target="_blank"
                                                            style={{
                                                                color: 'rgba(255, 255, 255, 0.9)',
                                                                textDecoration: 'none',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                                                        >
                                                            {siteSettings.address}
                                                        </Link>
                                                    </h6>
                                                ) : (
                                                    <h6 style={{
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        fontSize: '15px',
                                                        marginBottom: '15px',
                                                        lineHeight: '1.6'
                                                    }}>
                                                        <Link href="https://www.google.com/maps" 
                                                            target="_blank"
                                                            style={{
                                                                color: 'rgba(255, 255, 255, 0.9)',
                                                                textDecoration: 'none',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                                                        >
                                                            İstanbul, Türkiye
                                                        </Link>
                                                    </h6>
                                                )}
                                                {siteSettings?.phone ? (
                                                    <h4 style={{
                                                        color: '#ffffff',
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        marginTop: '10px'
                                                    }}>
                                                        <Link href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
                                                            style={{
                                                                color: '#ffffff',
                                                                textDecoration: 'none',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                                                        >
                                                            {siteSettings.phone}
                                                        </Link>
                                                    </h4>
                                                ) : (
                                                    <h4 style={{
                                                        color: '#ffffff',
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        marginTop: '10px'
                                                    }}>
                                                        <Link href="tel:+902121234567"
                                                            style={{
                                                                color: '#ffffff',
                                                                textDecoration: 'none',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                                                        >
                                                            +90 (212) 123 45 67
                                                        </Link>
                                                    </h4>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 lg-mt-30">
                                        <div className="footer__one-widget ml-40 lg-ml-0" style={{ marginBottom: '40px' }}>
                                            <h4 style={{
                                                color: '#ffffff',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                marginBottom: '25px',
                                                position: 'relative',
                                                paddingBottom: '15px'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    width: '50px',
                                                    height: '3px',
                                                    background: 'linear-gradient(90deg, #007bff, #0056b3)',
                                                    borderRadius: '2px'
                                                }}></span>
                                                Hızlı Linkler
                                            </h4>
                                            <div className="footer-widget-menu">
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    <li style={{ marginBottom: '12px' }}>
                                                        <Link href="/hakkimizda" style={{
                                                            color: 'rgba(255, 255, 255, 0.8)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            transition: 'all 0.3s ease',
                                                            display: 'inline-block',
                                                            position: 'relative',
                                                            paddingLeft: '20px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#007bff';
                                                            e.currentTarget.style.paddingLeft = '25px';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                                            e.currentTarget.style.paddingLeft = '20px';
                                                        }}
                                                        >
                                                            <span style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                transition: 'all 0.3s ease'
                                                            }}>→</span>
                                                            Hakkımızda
                                                        </Link>
                                                    </li>
                                                    <li style={{ marginBottom: '12px' }}>
                                                        <Link href="/blog" style={{
                                                            color: 'rgba(255, 255, 255, 0.8)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            transition: 'all 0.3s ease',
                                                            display: 'inline-block',
                                                            position: 'relative',
                                                            paddingLeft: '20px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#007bff';
                                                            e.currentTarget.style.paddingLeft = '25px';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                                            e.currentTarget.style.paddingLeft = '20px';
                                                        }}
                                                        >
                                                            <span style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                transition: 'all 0.3s ease'
                                                            }}>→</span>
                                                            Blog
                                                        </Link>
                                                    </li>
                                                    <li style={{ marginBottom: '12px' }}>
                                                        <Link href="/portfolio/3-columns" style={{
                                                            color: 'rgba(255, 255, 255, 0.8)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            transition: 'all 0.3s ease',
                                                            display: 'inline-block',
                                                            position: 'relative',
                                                            paddingLeft: '20px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#007bff';
                                                            e.currentTarget.style.paddingLeft = '25px';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                                            e.currentTarget.style.paddingLeft = '20px';
                                                        }}
                                                        >
                                                            <span style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                transition: 'all 0.3s ease'
                                                            }}>→</span>
                                                            Referanslar
                                                        </Link>
                                                    </li>
                                                    <li style={{ marginBottom: '12px' }}>
                                                        <Link href="/iletisim" style={{
                                                            color: 'rgba(255, 255, 255, 0.8)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            transition: 'all 0.3s ease',
                                                            display: 'inline-block',
                                                            position: 'relative',
                                                            paddingLeft: '20px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#007bff';
                                                            e.currentTarget.style.paddingLeft = '25px';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                                            e.currentTarget.style.paddingLeft = '20px';
                                                        }}
                                                        >
                                                            <span style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                transition: 'all 0.3s ease'
                                                            }}>→</span>
                                                            İletişim
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-sm-6 lg-mt-30">
                                        <div className="footer__one-widget address" style={{ marginBottom: '40px' }}>
                                            <h4 style={{
                                                color: '#ffffff',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                marginBottom: '25px',
                                                position: 'relative',
                                                paddingBottom: '15px'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    width: '50px',
                                                    height: '3px',
                                                    background: 'linear-gradient(90deg, #007bff, #0056b3)',
                                                    borderRadius: '2px'
                                                }}></span>
                                                Destek
                                            </h4>
                                            <div className="footer-widget-menu">
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    <li style={{ marginBottom: '12px' }}>
                                                        <Link href="/iletisim" style={{
                                                            color: 'rgba(255, 255, 255, 0.8)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            transition: 'all 0.3s ease',
                                                            display: 'inline-block',
                                                            position: 'relative',
                                                            paddingLeft: '20px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#007bff';
                                                            e.currentTarget.style.paddingLeft = '25px';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                                            e.currentTarget.style.paddingLeft = '20px';
                                                        }}
                                                        >
                                                            <span style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                transition: 'all 0.3s ease'
                                                            }}>→</span>
                                                            Kullanım Şartları
                                                        </Link>
                                                    </li>
                                                    <li style={{ marginBottom: '12px' }}>
                                                        <Link href="/iletisim" style={{
                                                            color: 'rgba(255, 255, 255, 0.8)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            transition: 'all 0.3s ease',
                                                            display: 'inline-block',
                                                            position: 'relative',
                                                            paddingLeft: '20px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.color = '#007bff';
                                                            e.currentTarget.style.paddingLeft = '25px';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                                            e.currentTarget.style.paddingLeft = '20px';
                                                        }}
                                                        >
                                                            <span style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                transition: 'all 0.3s ease'
                                                            }}>→</span>
                                                            Gizlilik Politikası
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
            <div className="copyright__area" style={{
                background: '#0d1117',
                padding: '25px 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div className="container">
                    <div className="row al-center">
                        <div className="col-md-7">
                            <div className="copyright__area-content md-t-center md-mb-10">
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '14px',
                                    margin: 0
                                }}>
                                    Copyright 2025 – ALPDİNAMİK  Tüm Hakları Saklıdır. <Link href="https://alpdinamik.com.tr/" target="_blank" style={{
                                        color: '#007bff',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#0056b3'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#007bff'}
                                    >ALPDİNAMİK</Link>
                                </p>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="copyright__area-social t-right md-t-center">
                                <Social />						
                            </div>
                        </div>
                    </div>
                </div>
            </div>       
        </>
    );
};

export default FooterOne;