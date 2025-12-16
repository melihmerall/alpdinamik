"use client"
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from 'swiper/modules'
import Link from "next/link"
import Image from "next/image"
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

const ProductsSlider = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products/all?limit=15')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          
          // Preload only first 3 images (above the fold)
          if (data && data.length > 0) {
            data.slice(0, 3).forEach((product) => {
              if (product.imageUrl && !product.imageUrl.startsWith('http')) {
                // Only preload local images
                const link = document.createElement('link')
                link.rel = 'preload'
                link.as = 'image'
                link.href = product.imageUrl
                document.head.appendChild(link)
              }
            })
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Loop için yeterli slide kontrolü
  const canLoop = products.length > 3;
  
  const slideControl = {
    spaceBetween: 30,
    slidesPerView: 3,
    speed: 600,
    loop: canLoop,
    autoplay: canLoop ? {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    } : false,
    navigation: {
      nextEl: '.products-slider-next',
      prevEl: '.products-slider-prev',
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
  }

  if (loading) {
    return (
      <div className="price__area section-padding" style={{ 
        background: 'transparent',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div className="container">
          <div className="row mb-50">
            <div className="col-xl-12">
              <div className="price__area-title t-center">
                <span className="subtitle">Ürünlerimiz</span>
                <h2>Ürün Portföyümüz</h2>
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
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="price__area section-padding" style={{ 
      background: 'transparent !important',
      paddingTop: '80px',
      paddingBottom: '80px'
    }}>
      <div className="container">
        <div className="row mb-50">
          <div className="col-xl-12">
            <div className="price__area-title t-center">
              <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Ürünlerimiz</span>
              <h2 className="wow fadeInRight" data-wow-delay=".6s">Ürün Portföyümüz</h2>
            </div>
          </div>
        </div>
        
        <div className="row wow fadeInUp" data-wow-delay=".5s">
          <div className="col-xl-12">
            <div className="slider-area" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <Swiper 
                modules={[Navigation, Autoplay]} 
                {...slideControl}
                className="products-swiper"
                style={{ width: '100%', overflow: 'hidden' }}
              >
                {products.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <div className="blog__one-item wow fadeInUp" data-wow-delay={`${0.4 + (index * 0.1)}s`} style={{
                      background: 'var(--bg-white)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      <div className="blog__one-item-image" style={{ position: 'relative', width: '100%', height: '270px' }}>
                        <Link href={`/temsilcilikler/${product.representative?.slug}/urunler/${product.slug}`} prefetch>
                          {product.imageUrl && product.imageUrl.startsWith('http') ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '270px',
                                objectFit: 'cover',
                                borderRadius: '12px 12px 0 0'
                              }}
                              loading={index < 3 ? 'eager' : 'lazy'}
                            />
                          ) : (
                            <Image
                              src={product.imageUrl || '/assets/img/blog/blog-1.jpg'}
                              alt={product.name}
                              width={400}
                              height={270}
                              style={{
                                width: '100%',
                                height: 'auto',
                                minHeight: '270px',
                                objectFit: 'cover',
                                borderRadius: '12px 12px 0 0'
                              }}
                              loading={index < 3 ? 'eager' : 'lazy'}
                              priority={index < 3}
                            />
                          )}
                        </Link>
                        {product.representative?.name && (
                          <div className="blog__one-item-image-date" style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            background: 'var(--bg-white)',
                            padding: '8px 20px',
                            borderRadius: '0 8px 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                          }}>
                            <span style={{ 
                              fontSize: '12px', 
                              color: 'var(--body-color)',
                              textTransform: 'uppercase',
                              marginBottom: '2px'
                            }}>{product.representative.name}</span>
                            {product.maxCapacity && (
                              <h6 style={{ 
                                margin: 0, 
                                fontSize: '16px', 
                                fontWeight: '600',
                                color: 'var(--primary-color-1)',
                                lineHeight: '1.2'
                              }}>Max. {product.maxCapacity}</h6>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="blog__one-item-content" style={{ 
                        padding: '20px 25px 25px 25px',
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        {product.series?.category && (
                          <span style={{
                            fontSize: '12px',
                            color: 'var(--primary-color-1)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '8px',
                            display: 'inline-block'
                          }}>
                            {product.series.category.name}
                          </span>
                        )}
                        <h6 style={{ 
                          margin: 0,
                          marginBottom: 'auto',
                          fontSize: '18px',
                          lineHeight: '1.5',
                          fontWeight: '600'
                        }}>
                          <Link 
                            href={`/temsilcilikler/${product.representative?.slug}/urunler/${product.slug}`} 
                            style={{ 
                              color: 'var(--text-heading-color)',
                              textDecoration: 'none',
                              transition: 'color 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = 'var(--primary-color-1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = 'var(--text-heading-color)';
                            }}
                          >
                            {product.name}
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="slider-arrow products-slider-arrows">
                <button 
                  type="button"
                  className="slider-arrow-prev products-slider-prev"
                  aria-label="Önceki ürün"
                >
                  <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                </button>
                <button 
                  type="button"
                  className="slider-arrow-next products-slider-next"
                  aria-label="Sonraki ürün"
                >
                  <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Products Slider - Prevent Scrollbar */
        .products-swiper {
          overflow: hidden !important;
          width: 100% !important;
          position: relative !important;
          padding: 0 60px !important;
        }
        .products-swiper .swiper-container {
          overflow: hidden !important;
          width: 100% !important;
          position: relative !important;
        }
        .products-swiper .swiper-wrapper {
          overflow: visible !important;
        }
        .products-swiper .swiper-slide {
          overflow: hidden !important;
          height: auto !important;
          display: flex !important;
        }
        .slider-area {
          overflow: hidden !important;
          width: 100% !important;
          position: relative !important;
        }
        /* Slider Navigation Arrows - Theme Style */
        .products-slider-arrows {
          position: relative;
        }
        .products-slider-arrows button {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          outline: none;
        }
        .products-slider-arrows button i {
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
        .products-slider-arrows button i:hover {
          color: var(--color-1);
          background: var(--primary-color-1);
          border-color: var(--primary-color-1);
        }
        @media (max-width: 991px) {
          .products-swiper {
            padding: 0 15px !important;
          }
        }
        /* Products Slider Responsive Styles */
        @media (max-width: 1199px) {
          .price__area {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
          }
          .price__area-title h2 {
            font-size: clamp(28px, 5vw, 40px) !important;
          }
        }
        /* Slider Navigation Arrows - Theme Style */
        .products-slider-arrows {
          position: relative;
        }
        .products-slider-arrows button {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          outline: none;
        }
        .products-slider-arrows button i {
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
        .products-slider-arrows button i:hover {
          color: var(--color-1);
          background: var(--primary-color-1);
          border-color: var(--primary-color-1);
        }
        @media (max-width: 991px) {
          .products-slider-arrows {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .price__area {
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }
          .price__area-title {
            margin-bottom: 30px !important;
          }
          .price__area-title .subtitle {
            font-size: 14px !important;
          }
          .price__area-title h2 {
            font-size: clamp(24px, 7vw, 32px) !important;
            line-height: 1.3 !important;
          }
          .blog__one-item {
            margin-bottom: 20px;
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
          .products-slider-arrows {
            display: none !important;
          }
        }
        @media (max-width: 575px) {
          .price__area-title h2 {
            font-size: 22px !important;
          }
          .blog-card-image {
            height: 180px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ProductsSlider

