"use client"
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation} from 'swiper/modules';
import { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const BlogTwo = () => {
    const [blogItem, setBlogItem] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBlog() {
            try {
                const response = await fetch('/api/blog?published=true&limit=4');
                if (response.ok) {
                    const data = await response.json();
                    const posts = data.data || [];
                    setBlogItem(posts);
                    
                    // Preload only first 3 images (above the fold)
                    if (posts && posts.length > 0) {
                        posts.slice(0, 3).forEach((post) => {
                            if (post.imageUrl && !post.imageUrl.startsWith('http')) {
                                // Only preload local images
                                const link = document.createElement('link')
                                link.rel = 'preload'
                                link.as = 'image'
                                link.href = post.imageUrl
                                document.head.appendChild(link)
                            }
                        })
                    }
                }
            } catch (error) {
                console.error('Error loading blog:', error);
            } finally {
                setLoading(false);
            }
        }
        loadBlog();
    }, []);
    
    // Loop modu için yeterli slide olup olmadığını kontrol et (en az slidesPerView + 1 slide gerekli)
    const canLoop = blogItem.length > 3;
    
    const slideControl = {
        spaceBetween: 30,
        speed: 600,
        loop: canLoop,
        slidesPerView: 3,
        autoplay: canLoop ? {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        } : false,
        navigation: {
            nextEl: '.blog_next',
            prevEl: '.blog_prev',
        },
        grabCursor: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 15,
            },
            576: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 25,
            },
            992: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    };
    if (loading) {
        return (
            <div className="blog__two section-padding-two">
                <div className="container">
                    <div className="row mb-55">
                        <div className="col-xl-12">
                            <div className="blog__two-title t-center">
                                <span className="subtitle">Haberler & Blog</span>
                                <h2>Güncel Haberler ve Blog Yazıları</h2>
                            </div>					
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="slider-area" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', gap: '25px', overflow: 'hidden' }}>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} style={{
                                            flex: '0 0 calc(33.333% - 17px)',
                                            background: 'var(--bg-white)',
                                            border: '1px solid rgba(0, 0, 0, 0.08)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            minHeight: '400px'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                height: '270px',
                                                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                                backgroundSize: '200% 100%',
                                                animation: 'shimmer 1.5s infinite'
                                            }} />
                                            <div style={{ padding: '20px 25px' }}>
                                                <div style={{
                                                    height: '12px',
                                                    width: '60%',
                                                    background: '#e0e0e0',
                                                    borderRadius: '4px',
                                                    marginBottom: '10px'
                                                }} />
                                                <div style={{
                                                    height: '12px',
                                                    width: '80%',
                                                    background: '#e0e0e0',
                                                    borderRadius: '4px'
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="blog__two section-padding-two">
            <div className="container">
                <div className="row mb-55">
                    <div className="col-xl-12">
                        <div className="blog__two-title t-center">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Haberler & Blog</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Güncel Haberler ve Blog Yazıları</h2>
                        </div>					
                    </div>
                </div>
                <div className="row wow fadeInUp" data-wow-delay=".5s">
                    <div className="col-xl-12">
                        <div className="slider-area" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                            <Swiper 
                                modules={[Autoplay, Navigation]} 
                                {...slideControl}
                                className="blog-swiper"
                                style={{ width: '100%', overflow: 'hidden' }}
                            >
                                {blogItem?.map((data, id) => {
                                    const publishedDate = data.publishedAt ? new Date(data.publishedAt) : null;
                                    const day = publishedDate ? publishedDate.getDate() : '';
                                    const month = publishedDate ? publishedDate.toLocaleDateString('tr-TR', { month: 'short' }) : '';
                                    
                                    return (
                                    <SwiperSlide key={id}>
                                            <div className="blog__one-item blog-card-modern" style={{
                                                width: '100%'
                                            }}>
                                                <div className="blog__one-item-image" style={{ position: 'relative', width: '100%', height: '270px' }}>
                                                    <Link href={`/blog/${data.slug}`} prefetch>
                                                        {data.imageUrl && data.imageUrl.startsWith('http') ? (
                                                            <img
                                                                src={data.imageUrl}
                                                                alt={data.title || 'blog'}
                                                                className="blog-card-image"
                                                                loading={id < 3 ? 'eager' : 'lazy'}
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={data.imageUrl || '/assets/img/blog/blog-1.jpg'}
                                                                alt={data.title || 'blog'}
                                                                width={400}
                                                                height={270}
                                                                className="blog-card-image"
                                                                style={{
                                                                    width: '100%',
                                                                    height: 'auto',
                                                                    minHeight: '270px',
                                                                    objectFit: 'cover'
                                                                }}
                                                                loading={id < 3 ? 'eager' : 'lazy'}
                                                                priority={id < 3}
                                                            />
                                                        )}
                                                    </Link>
                                                    {publishedDate && (
                                                <div className="blog__one-item-image-date">
                                                            <h6>{day}</h6>
                                                            <span>{month}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="blog__one-item-content">
                                                    <h6>
                                                        <Link href={`/blog/${data.slug}`} className="blog-card-title">
                                                            {data.title}
                                                        </Link>
                                                    </h6>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className="slider-arrow blog-slider-arrows">
                                <button 
                                    type="button"
                                    className="slider-arrow-prev blog_prev"
                                    aria-label="Önceki blog"
                                >
                                    <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                                </button>
                                <button 
                                    type="button"
                                    className="slider-arrow-next blog_next"
                                    aria-label="Sonraki blog"
                                >
                                    <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                /* Blog Slider - Prevent Scrollbar */
                .blog__two .blog-swiper {
                    overflow: hidden !important;
                    width: 100% !important;
                    position: relative !important;
                    padding: 0 60px !important;
                }
                .blog__two .blog-swiper .swiper-wrapper {
                    overflow: visible !important;
                }
                .blog__two .blog-swiper .swiper-container {
                    overflow: hidden !important;
                    width: 100% !important;
                    position: relative !important;
                }
                .blog__two .blog-swiper .swiper-slide {
                    overflow: hidden !important;
                    height: auto !important;
                    display: flex !important;
                }
                .blog__two .slider-area {
                    overflow: hidden !important;
                    width: 100% !important;
                    position: relative !important;
                }
                @media (max-width: 991px) {
                    .blog__two .blog-swiper {
                        padding: 0 15px !important;
                    }
                }
                .blog__two {
                    background: transparent !important;
                    padding-top: 80px;
                    padding-bottom: 80px;
                    overflow: hidden !important;
                }
                .blog-card-modern {
                    background: var(--bg-white);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .blog-card-modern:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                    transform: translateY(-4px);
                }
                .blog__one-item-image {
                    position: relative;
                }
                .blog-card-image {
                    width: 100%;
                    height: 270px;
                    object-fit: cover;
                    border-radius: 12px 12px 0 0;
                }
                .blog__one-item-image-date {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background: var(--bg-white);
                    padding: 8px 20px;
                    border-radius: 0 8px 0 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .blog__one-item-image-date h6 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-heading-color);
                    line-height: 1.2;
                }
                .blog__one-item-image-date span {
                    font-size: 12px;
                    color: var(--body-color);
                    text-transform: uppercase;
                    margin-top: 2px;
                }
                .blog__one-item-content {
                    padding: 20px 25px 25px 25px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .blog__one-item-content h6 {
                    margin: 0;
                    margin-bottom: auto;
                    font-size: 18px;
                    line-height: 1.5;
                    font-weight: 600;
                }
                .blog-card-title {
                    color: var(--text-heading-color);
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                .blog-card-title:hover {
                    color: var(--primary-color-1);
                }
                /* Blog Two Responsive Styles */
                @media (max-width: 1199px) {
                    .blog__two {
                        padding-top: 60px !important;
                        padding-bottom: 60px !important;
                    }
                    .blog__two-title h2 {
                        font-size: clamp(28px, 5vw, 40px) !important;
                    }
                }
                /* Slider Navigation Arrows - Theme Style */
                .blog-slider-arrows {
                    position: relative;
                }
                .blog-slider-arrows button {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    outline: none;
                }
                .blog-slider-arrows button i {
                    font-size: 24px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: var(--text-heading-color);
                    background: var(--bg-white);
                    transition: 0.4s;
                    border: 1px solid var(--border-color-1);
                    width: 60px;
                    height: 60px;
                    cursor: pointer;
                }
                .blog-slider-arrows button i:hover {
                    color: var(--color-1);
                    background: var(--primary-color-1);
                    border-color: var(--primary-color-1);
                }
                @media (max-width: 991px) {
                    .blog-slider-arrows {
                        display: none !important;
                    }
                }
                @media (max-width: 767px) {
                    .blog__two {
                        padding-top: 40px !important;
                        padding-bottom: 40px !important;
                    }
                    .blog__two-title {
                        margin-bottom: 30px !important;
                    }
                    .blog__two-title .subtitle {
                        font-size: 14px !important;
                    }
                    .blog__two-title h2 {
                        font-size: clamp(24px, 7vw, 32px) !important;
                        line-height: 1.3 !important;
                    }
                    .blog-card-image {
                        height: 200px !important;
                    }
                    .blog__one-item-content {
                        padding: 15px 20px 20px 20px !important;
                    }
                    .blog__one-item-content h6 {
                        font-size: 16px !important;
                    }
                    .blog-slider-arrows {
                        display: none !important;
                    }
                }
                @media (max-width: 575px) {
                    .blog__two-title h2 {
                        font-size: 22px !important;
                    }
                    .blog-card-image {
                        height: 180px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BlogTwo;