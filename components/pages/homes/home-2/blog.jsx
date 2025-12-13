"use client"
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import { useState, useEffect } from 'react';

const BlogTwo = () => {
    const [blogItem, setBlogItem] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBlog() {
            try {
                const response = await fetch('/api/blog?published=true&limit=4');
                if (response.ok) {
                    const data = await response.json();
                    setBlogItem(data.data || []);
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
        spaceBetween: 25,
        speed: 1000,
        loop: canLoop,
        slidesPerView: 3,
        autoplay: canLoop ? {
            delay: 4000,
            reverseDirection: false,
            disableOnInteraction: false,
        } : false,
        navigation: {
            nextEl: '.blog_next',
            prevEl: '.blog_prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    };
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
                        <div className="slider-area">
                            <Swiper modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                                {blogItem?.map((data, id) => {
                                    const publishedDate = data.publishedAt ? new Date(data.publishedAt) : null;
                                    const day = publishedDate ? publishedDate.getDate() : '';
                                    const month = publishedDate ? publishedDate.toLocaleDateString('tr-TR', { month: 'short' }) : '';
                                    
                                    return (
                                        <SwiperSlide key={id}>
                                            <div className="blog__one-item blog-card-modern">
                                                <div className="blog__one-item-image">
                                                    <Link href={`/blog/${data.slug}`}>
                                                        <img 
                                                            src={data.imageUrl || '/assets/img/blog/blog-1.jpg'} 
                                                            alt="blog"
                                                            className="blog-card-image"
                                                        />
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
                            <div className="slider-arrow">
                                <div className="slider-arrow-prev blog_prev">
                                    <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                                </div>
                                <div className="slider-arrow-next blog_next">
                                    <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .blog__two {
                    background: transparent !important;
                    padding-top: 80px;
                    padding-bottom: 80px;
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
                    .slider-arrow {
                        display: flex !important;
                        justify-content: center !important;
                        margin-top: 20px !important;
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