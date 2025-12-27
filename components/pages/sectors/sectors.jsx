"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"

const SectorsMain = () => {
  const [sectorsData, setSectorsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSectors() {
      try {
        // Relative URL kullan - browser otomatik olarak mevcut domain'i kullanır
        const response = await fetch('/api/sectors')
        if (response.ok) {
          const data = await response.json()
          setSectorsData(data.data || data)
        }
      } catch (error) {
        console.error('Error fetching sectors:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSectors()
  }, [])

  if (loading) {
    return (
      <div className="three__columns section-padding-three">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="three__columns section-padding-three">
      <div className="container">
        <div className="row mb-50">
          <div className="col-xl-12">
            <div className="section-title t-center">
              <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Uygulama Alanlarımız</span>
              <h2 className="wow fadeInRight" data-wow-delay=".6s">Hizmet Verdiğimiz Sektörler</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {sectorsData?.length > 0 ? (
            sectorsData.map((data, id) => (
              <div className="col-lg-4 col-md-6" key={id} style={{ marginBottom: '2.5rem', paddingLeft: '15px', paddingRight: '15px' }}>
                <div className="portfolio__three-item" style={{ height: '100%' }}>
                  {data.imageUrl ? (
                    <img 
                      src={data.imageUrl} 
                      alt={data.name}
                      style={{
                        width: '100%',
                        height: '280px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '280px', 
                      background: 'var(--color-2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--body-color)',
                      borderRadius: '8px'
                    }}>
                      Görsel Yok
                    </div>
                  )}
                  <div className="portfolio__three-item-content">
                    <Link href={`/sektorler/${data.slug}`}>
                      <i className="flaticon flaticon-right-up"></i>
                    </Link>
                    <span>Uygulama Alanı</span>
                    <h4>
                      <Link href={`/sektorler/${data.slug}`}>{data.name}</Link>
                    </h4>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-xl-12">
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem', 
                background: 'var(--color-2)', 
                borderRadius: '8px' 
              }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--body-color)' }}>Henüz sektör eklenmemiş.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SectorsMain

