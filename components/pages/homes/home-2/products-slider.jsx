"use client"
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from 'swiper/modules'
import Link from "next/link"
import 'swiper/css'
import 'swiper/css/navigation'

const ProductsSlider = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/all?limit=15`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const slideControl = {
    spaceBetween: 25,
    slidesPerView: 1,
    speed: 500,
    loop: products.length > 3,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.products-slider-next',
      prevEl: '.products-slider-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1025: {
        slidesPerView: 3,
      },
      1600: {
        slidesPerView: 3,
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
            <div className="col-xl-12 t-center">
              <p>Yükleniyor...</p>
            </div>
          </div>
        </div>
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
            <div className="slider-area">
              <Swiper 
                modules={[Navigation, Autoplay]} 
                {...slideControl}
                className="products-swiper"
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
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      <div className="blog__one-item-image" style={{ position: 'relative' }}>
                        <Link href={`/temsilcilikler/${product.representative?.slug}/urunler/${product.slug}`}>
                          <img 
                            src={product.imageUrl || '/assets/img/blog/blog-1.jpg'} 
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '270px',
                              objectFit: 'cover',
                              borderRadius: '12px 12px 0 0'
                            }}
                          />
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
              <div className="slider-arrow">
                <div className="slider-arrow-prev products-slider-prev">
                  <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                </div>
                <div className="slider-arrow-next products-slider-next">
                  <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
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
          .slider-arrow {
            display: flex !important;
            justify-content: center !important;
            margin-top: 20px !important;
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

