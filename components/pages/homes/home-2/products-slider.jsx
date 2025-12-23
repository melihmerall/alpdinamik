"use client"
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from 'swiper/modules'
import Link from "next/link"
import Image from "next/image"
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

const FALLBACK_CATEGORY_IMAGE = '/assets/img/blog/blog-1.jpg'

const renderCategoryImage = ({ imageUrl, alt, shouldPrioritize }) => {
  const resolvedUrl = imageUrl || FALLBACK_CATEGORY_IMAGE
  const sharedImageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
    display: 'block'
  }

  if (resolvedUrl.startsWith('http')) {
    return (
      <img
        src={resolvedUrl}
        alt={alt}
        loading={shouldPrioritize ? 'eager' : 'lazy'}
        style={sharedImageStyles}
      />
    )
  }

  return (
    <Image
      src={resolvedUrl}
      alt={alt}
      width={900}
      height={600}
      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
      priority={shouldPrioritize}
      style={sharedImageStyles}
    />
  )
}

const ProductsSlider = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories/all?limit=15')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
          
          // Preload only first 3 images (above the fold)
          if (data && data.length > 0) {
            data.slice(0, 3).forEach((category) => {
              const imageUrl = category.breadcrumbImageUrl || category.imageUrl
              if (imageUrl && !imageUrl.startsWith('http')) {
                // Only preload local images
                const link = document.createElement('link')
                link.rel = 'preload'
                link.as = 'image'
                link.href = imageUrl
                document.head.appendChild(link)
              }
            })
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Loop için yeterli slide kontrolü
  const canLoop = categories.length > 3;
  
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
              <h2>Ürünlerimiz</h2>
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

  // Always render the section, even if empty
  // This ensures the component is visible on first page load
  if (categories.length === 0 && !loading) {
    // If no categories after loading, show empty state
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
                <h2 className="wow fadeInRight" data-wow-delay=".6s">Ürünlerimiz</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="t-center" style={{ padding: '40px 0' }}>
                <p style={{ color: 'var(--body-color)' }}>Henüz kategori bulunmamaktadır.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
              <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Kategorilerimiz</span>
              <h2 className="wow fadeInRight" data-wow-delay=".6s">Ürün Kategorileri</h2>
            </div>
          </div>
        </div>
        
        <div className="row wow fadeInUp" data-wow-delay=".5s">
          <div className="col-xl-12">
            <div className="slider-area" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <button 
                type="button"
                className="products-slider-nav products-slider-prev"
                aria-label="Önceki ürün"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                type="button"
                className="products-slider-nav products-slider-next"
                aria-label="Sonraki ürün"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Swiper 
                modules={[Navigation, Autoplay]} 
                {...slideControl}
                className="products-swiper"
                style={{ width: '100%', overflow: 'hidden' }}
              >
                {categories.map((category, index) => {
                  const categoryName = category.name || 'Ürün Kategorisi'
                  const representativeName = category.representative?.name
                  const badgeLabel = category.categoryGroup || category.sector || 'Öne Çıkan'
                  const eyebrowLabel = category.industry || category.focusArea || 'Lineer Hareket Çözümü'
                  const categoryUrl = category.representative?.slug && category.slug
                    ? `/temsilcilikler/${category.representative.slug}/kategoriler/${category.slug}`
                    : '/temsilcilikler'
                  const imageUrl = category.breadcrumbImageUrl || category.imageUrl
                  const productCountLabel = category.productCount ? `${category.productCount}+ ürün` : 'Hazır çözümler'
                  const seriesCountLabel = category.seriesCount ? `${category.seriesCount}+ seri` : 'Esnek konfigürasyon'
                  const tagline = category.tagline || 'Projelerinize özel mühendislik desteği ve uygulama danışmanlığı.'
                  const shouldPrioritize = index < 3

                  return (
                    <SwiperSlide key={`${category.id || category.slug}-${index}`}>
                      <article
                        className="products-card wow fadeInUp"
                        data-wow-delay={`${0.4 + (index * 0.1)}s`}
                      >
                        <div className="products-card__image">
                          <div className="products-card__image-wrapper">
                            {renderCategoryImage({ imageUrl, alt: categoryName, shouldPrioritize })}
                          </div>
                          <span className="products-card__badge">
                            {badgeLabel}
                          </span>
                          {representativeName && (
                            <div className="products-card__rep">
                              <i className="fas fa-building" aria-hidden="true"></i>
                              <span>{representativeName}</span>
                            </div>
                          )}
                        </div>
                        <div className="products-card__body">
                          <span className="products-card__eyebrow">{eyebrowLabel}</span>
                          <h3>
                            <Link
                              href={categoryUrl}
                              prefetch
                              aria-label={`${categoryName} kategorisini incele`}
                              style={{
                                color: 'var(--text-heading-color)',
                                textDecoration: 'none',
                                transition: 'color 0.3s ease'
                              }}
                            >
                              {categoryName}
                            </Link>
                          </h3>
                          <div className="products-card__chips">
                            <span className="products-card__chip">
                              <i className="fas fa-layer-group" aria-hidden="true"></i>
                              {seriesCountLabel}
                            </span>
                            <span className="products-card__chip">
                              <i className="fas fa-cubes" aria-hidden="true"></i>
                              {productCountLabel}
                            </span>
                          </div>
                          <div className="products-card__footer">
                            <div className="products-card__tagline">
                              {tagline}
                            </div>
                            <Link
                              href={categoryUrl}
                              prefetch
                              className="products-card__cta"
                              aria-label={`${categoryName} kategorisine git`}
                            >
                              Detayları İncele
                              <span aria-hidden="true">
                                <i className="fas fa-arrow-right"></i>
                              </span>
                            </Link>
                          </div>
                        </div>
                      </article>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .products-swiper {
          overflow: hidden !important;
          width: 100% !important;
          position: relative !important;
          padding: 0 !important;
        }
        .products-swiper .swiper-wrapper {
          overflow: visible !important;
        }
        .products-swiper .swiper-slide {
          height: auto !important;
          display: flex !important;
        }
        .products-card {
          background: var(--bg-white);
          border-radius: 18px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .products-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
        }
        .products-card__image {
          position: relative;
          padding: 20px 20px 0 20px;
        }
        .products-card__image-wrapper {
          width: 100%;
          aspect-ratio: 16 / 10;
          min-height: 240px;
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(6, 17, 48, 0.04), rgba(6, 17, 48, 0.09));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          position: relative;
        }
        .products-card__image-wrapper img {
          max-height: 100%;
          max-width: 100%;
        }
        .products-card__image-wrapper span {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          position: relative !important;
        }
        .products-card__badge {
          position: absolute;
          top: 32px;
          left: 34px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(6, 17, 48, 0.8);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .products-card__rep {
          position: absolute;
          bottom: 18px;
          left: 32px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(15, 23, 42, 0.08);
          font-weight: 600;
          color: var(--text-heading-color);
          font-size: 12px;
          letter-spacing: 0.02em;
        }
        .products-card__rep i {
          color: var(--primary-color-1);
        }
        .products-card__body {
          padding: 22px 24px 26px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }
        .products-card__eyebrow {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(15, 23, 42, 0.55);
        }
        .products-card__body h3 {
          margin: 0;
          font-size: 22px;
          line-height: 1.4;
        }
        .products-card__body h3 a:hover {
          color: var(--primary-color-1) !important;
        }
        .products-card__body p {
          margin: 0;
          color: var(--body-color);
          line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .products-card__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }
        .products-card__chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.05);
          color: var(--text-heading-color);
          font-size: 13px;
          font-weight: 600;
        }
        .products-card__chip i {
          color: var(--primary-color-1);
        }
        .products-card__footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .products-card__tagline {
          font-size: 14px;
          color: var(--body-color);
          line-height: 1.6;
          background: rgba(15, 23, 42, 0.04);
          border-radius: 10px;
          padding: 10px 14px;
        }
        .products-card__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 999px;
          background: transparent;
          color: var(--primary-color-1);
          border: 1px solid rgba(0, 123, 255, 0.3);
          font-weight: 600;
          text-decoration: none;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .products-card__cta:hover {
          box-shadow: none;
          transform: translateY(-2px);
          border-color: var(--primary-color-1);
        }
        .slider-area {
          overflow: hidden !important;
          width: 100% !important;
          position: relative !important;
        }
        /* Products Slider Navigation Arrows */
        .products-slider-nav {
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
          color: var(--text-heading-color);
          cursor: pointer;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.75;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .products-slider-nav:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.35);
          opacity: 1;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }
        .products-slider-nav:active {
          transform: translateY(-50%) scale(0.96);
        }
        .products-slider-prev {
          left: 25px;
        }
        .products-slider-next {
          right: 25px;
        }
        .products-slider-nav svg {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }
        .products-slider-nav:hover svg {
          transform: scale(1.1);
        }
        .products-slider-nav.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .products-slider-nav.swiper-button-disabled:hover {
          transform: translateY(-50%) scale(1);
          background: rgba(255, 255, 255, 0.12);
        }
        @media (max-width: 991px) {
          .products-slider-nav {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
          }
          .products-slider-prev {
            left: 18px;
          }
          .products-slider-next {
            right: 18px;
          }
          .products-slider-nav svg {
            width: 14px;
            height: 14px;
          }
        }
        @media (max-width: 767px) {
          .products-slider-nav {
            width: 32px;
            height: 32px;
            min-width: 32px;
            min-height: 32px;
          }
          .products-slider-prev {
            left: 12px;
          }
          .products-slider-next {
            right: 12px;
          }
          .products-slider-nav svg {
            width: 12px;
            height: 12px;
          }
        }
        @media (max-width: 575px) {
          .products-slider-nav {
            width: 28px;
            height: 28px;
            min-width: 28px;
            min-height: 28px;
          }
          .products-slider-prev {
            left: 10px;
          }
          .products-slider-next {
            right: 10px;
          }
          .products-slider-nav svg {
            width: 11px;
            height: 11px;
          }
        }
        @media (max-width: 1199px) {
          .price__area {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
          }
        }
        @media (max-width: 991px) {
          .products-card__image {
            padding: 18px 18px 0 18px;
          }
          .products-card__badge {
            top: 28px;
            left: 32px;
          }
          .products-card__rep {
            left: 32px;
            bottom: 18px;
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
          .products-card__body {
            padding: 20px 22px 24px 22px;
          }
          .products-card__body h3 {
            font-size: 20px;
          }
          .products-card__chip {
            font-size: 12px;
          }
        }
        @media (max-width: 575px) {
          .products-card__badge {
            font-size: 10px;
          }
          .products-card__rep {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .products-card__cta {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
      </div>
    )
  }

export default ProductsSlider
