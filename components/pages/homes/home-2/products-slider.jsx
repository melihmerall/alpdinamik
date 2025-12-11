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
    speed: 1000,
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
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  }

  if (loading) {
    return (
      <div className="price__area section-padding">
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
    <div className="price__area section-padding">
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
                    <div className="price__area-item product-card-slider wow fadeInUp" data-wow-delay={`${0.4 + (index * 0.1)}s`} style={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {product.imageUrl ? (
                        <div className="price__area-item-image" style={{ 
                          marginBottom: '1.5rem',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          height: '200px',
                          background: '#f5f5f5',
                          flexShrink: 0
                        }}>
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="price__area-item-image" style={{ 
                          marginBottom: '1.5rem',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          height: '200px',
                          background: '#f5f5f5',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999'
                        }}>
                          <span>Görsel Yok</span>
                        </div>
                      )}
                      <div className="price__area-item-price" style={{ flexShrink: 0 }}>
                        <span>{product.representative?.name || 'Ürün'}</span>
                        <h3>{product.name}</h3>
                        {product.maxCapacity && (
                          <h2>Max. <span>{product.maxCapacity}</span></h2>
                        )}
                      </div>
                      <div className="price__area-item-list" style={{ 
                        flex: '1 1 auto',
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}>
                        {product.description ? (
                          <p style={{ 
                            padding: '1rem', 
                            color: '#666', 
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            minHeight: '80px',
                            width: '100%',
                            margin: 0
                          }}>
                            {product.description.length > 120 
                              ? `${product.description.substring(0, 120)}...` 
                              : product.description}
                          </p>
                        ) : (
                          <p style={{ 
                            padding: '1rem', 
                            color: '#999', 
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            minHeight: '80px',
                            width: '100%',
                            margin: 0,
                            fontStyle: 'italic'
                          }}>
                            Açıklama bulunmuyor
                          </p>
                        )}
                      </div>
                      <div className="price__area-item-btn" style={{ flexShrink: 0, marginTop: 'auto' }}>
                        <Link 
                          className="build_button" 
                          href={`/temsilcilikler/${product.representative?.slug}/urunler/${product.slug}`}
                        >
                          Ürünü İncele<i className="flaticon-right-up"></i>
                        </Link>
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
    </div>
  )
}

export default ProductsSlider

