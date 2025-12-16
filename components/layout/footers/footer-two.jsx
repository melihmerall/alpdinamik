"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import logo from "../../../public/assets/img/logo-2.png";
import Social from "@/components/data/social";
import ContactSection from "@/components/pages/common/contact-section";

const FooterTwo = () => {
    const pathname = usePathname();
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [siteSettings, setSiteSettings] = useState(null);
    const [mecmotLogo, setMecmotLogo] = useState(null);
    
    // Sadece anasayfada ContactSection göster
    const isHomePage = pathname === '/';

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch site settings
                const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/site-settings`);
                if (settingsResponse.ok) {
                    const settingsData = await settingsResponse.json();
                    setSiteSettings(settingsData);
                }

                // Fetch recent blogs
                const blogResponse = await fetch('/api/blog?published=true&limit=3');
                if (blogResponse.ok) {
                    const result = await blogResponse.json();
                    const posts = result.data || result;
                    // API already returns sorted by publishedAt desc, just take first 3
                    const recentPosts = Array.isArray(posts) ? posts.slice(0, 3) : [];
                    setRecentBlogs(recentPosts);
                }

                // Fetch Mecmot logo
                const representativesResponse = await fetch('/api/representatives?lightweight=true');
                if (representativesResponse.ok) {
                    const representativesData = await representativesResponse.json();
                    const mecmot = representativesData.find(rep => 
                        rep.slug === 'mecmot' || 
                        rep.name?.toLowerCase().includes('mecmot')
                    );
                    if (mecmot && mecmot.logoUrl) {
                        setMecmotLogo(mecmot.logoUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    return (
        <>
            {isHomePage && <ContactSection />}
            <div className="footer__two" style={{
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
                        <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="footer__two-widget" style={{ marginBottom: '40px' }}>
                                <div className="footer__two-widget-about">
                                    <Link href="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
                                        <img src={logo.src} alt="image" style={{ maxHeight: '50px', filter: 'brightness(0) invert(1)' }} />
                                    </Link>
                                    <p style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '16px',
                                        lineHeight: '1.8',
                                        marginBottom: '20px'
                                    }}>Lineer hareket sistemlerinde doğru ürün ve mühendislik çözümleri sunuyoruz. Mecmot markasının Türkiye temsilciliği ile projelerinize değer katıyoruz.</p>
                                    {mecmotLogo && (
                                        <div style={{
                                            marginBottom: '25px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <img 
                                                src={mecmotLogo} 
                                                alt="Mecmot Logo" 
                                                style={{
                                                    maxHeight: '50px',
                                                    maxWidth: '150px',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0) invert(1)',
                                                    opacity: 0.9
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="footer__two-widget-about-social">
                                        <Social />
                                    </div>							
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 md-mt-30">
                            <div className="footer__two-widget footer-border pl-60 md-pl-0" style={{ marginBottom: '40px' }}>
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
                                    İletişim Bilgileri
                                </h4>
                                <div className="footer__two-widget-location">
                                    {siteSettings?.address && (
                                        <>
                                            <div className="footer__two-widget-location-item" style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                marginBottom: '20px',
                                                padding: '15px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '8px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                            >
                                                <div className="footer__two-widget-location-item-icon" style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                                                    borderRadius: '8px',
                                                    marginRight: '15px',
                                                    flexShrink: 0
                                                }}>
                                                    <i className="flaticon-location" style={{ color: '#ffffff', fontSize: '18px' }}></i>
                                                </div>
                                                <div className="footer__two-widget-location-item-info" style={{ flex: 1 }}>
                                                    <Link 
                                                        href={siteSettings.mapEmbedUrl && siteSettings.mapEmbedUrl.includes('maps/embed') 
                                                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`
                                                            : siteSettings.mapEmbedUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`
                                                        } 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            lineHeight: '1.6',
                                                            transition: 'color 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                                                    >
                                                        {siteSettings.address}
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {siteSettings?.phone && (
                                        <>
                                            <h6 style={{
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                marginBottom: '10px',
                                                marginTop: '10px'
                                            }}>Telefon</h6>
                                            <div className="footer__two-widget-location-item" style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                marginBottom: '20px',
                                                padding: '15px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '8px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                            >
                                                <div className="footer__two-widget-location-item-icon" style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                                                    borderRadius: '8px',
                                                    marginRight: '15px',
                                                    flexShrink: 0
                                                }}>
                                                    <i className="flaticon-phone" style={{ color: '#ffffff', fontSize: '18px' }}></i>
                                                </div>
                                                <div className="footer__two-widget-location-item-info" style={{ flex: 1 }}>
                                                    <Link href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
                                                        style={{
                                                            color: '#ffffff',
                                                            textDecoration: 'none',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            transition: 'color 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                                                    >
                                                        {siteSettings.phone}
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {siteSettings?.email && (
                                        <>
                                            <h6 style={{
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                marginBottom: '10px',
                                                marginTop: '10px'
                                            }}>E-posta</h6>
                                            <div className="footer__two-widget-location-item" style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                marginBottom: '20px',
                                                padding: '15px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '8px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                            >
                                                <div className="footer__two-widget-location-item-icon" style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                                                    borderRadius: '8px',
                                                    marginRight: '15px',
                                                    flexShrink: 0
                                                }}>
                                                    <i className="flaticon-email-3" style={{ color: '#ffffff', fontSize: '18px' }}></i>
                                                </div>
                                                <div className="footer__two-widget-location-item-info" style={{ flex: 1 }}>
                                                    <Link href={`mailto:${siteSettings.email}`}
                                                        style={{
                                                            color: '#ffffff',
                                                            textDecoration: 'none',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            transition: 'color 0.3s ease',
                                                            wordBreak: 'break-word'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                                                    >
                                                        {siteSettings.email}
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 lg-mt-30">
                            <div className="footer__two-widget footer-border pl-60 lg-pl-0" style={{ marginBottom: '40px' }}>
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
                                    Son Yazılar
                                </h4>
                                <div className="all__sidebar-item-post">
                                    {loading ? (
                                        <div style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                                            <p>Yükleniyor...</p>
                                        </div>
                                    ) : recentBlogs.length > 0 ? (
                                        recentBlogs.map((data) => (
                                            <div className="post__item" key={data.id || data.slug} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                marginBottom: '20px',
                                                padding: '15px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                                e.currentTarget.style.transform = 'translateY(-3px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                            >
                                                <div className="post__item-image" style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    marginRight: '15px',
                                                    flexShrink: 0
                                                }}>
                                                    <Link href={`/blog/${data.slug}`}>
                                                        <img 
                                                            src={data.imageUrl || data.image?.src || '/assets/img/blog/blog-1.jpg'} 
                                                            alt={data.title || 'Blog'} 
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '100%', 
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="post__item-title" style={{ flex: 1 }}>
                                                    <span style={{
                                                        color: 'rgba(255, 255, 255, 0.6)',
                                                        fontSize: '12px',
                                                        display: 'block',
                                                        marginBottom: '8px'
                                                    }}>
                                                        <i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                                                        {formatDate(data.createdAt || data.publishedAt || data.date)}
                                                    </span>
                                                    <h6 style={{
                                                        margin: 0,
                                                        lineHeight: '1.4'
                                                    }}>
                                                        <Link href={`/blog/${data.slug}`} style={{
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                            textDecoration: 'none',
                                                            fontSize: '15px',
                                                            fontWeight: '500',
                                                            transition: 'color 0.3s ease',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                                                        >
                                                            {data.title}
                                                        </Link>
                                                    </h6>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                                            <p>Henüz blog yazısı yok.</p>
                                        </div>
                                    )}
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
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="copyright__area-content t-center">
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default FooterTwo;