"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"

const RepresentativesMain = () => {
  const [representativesData, setRepresentativesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRepresentatives() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/representatives`)
        if (response.ok) {
          const data = await response.json()
          // Filter only active representatives
          const activeReps = Array.isArray(data) ? data.filter(rep => rep.isActive !== false) : []
          setRepresentativesData(activeReps)
        }
      } catch (error) {
        console.error('Error fetching representatives:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRepresentatives()
  }, [])

  if (loading) {
    return (
      <div className="three__columns section-padding-three">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p style={{ color: 'var(--body-color)' }}>Yükleniyor...</p>
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
              <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Temsilciliklerimiz</span>
              <h2 className="wow fadeInRight" data-wow-delay=".6s">Temsil Ettiğimiz Markalar</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {representativesData?.length > 0 ? (
            representativesData.map((data, id) => (
              <div className="col-lg-4 col-md-6" key={id} style={{ marginBottom: '2.5rem', paddingLeft: '15px', paddingRight: '15px' }}>
                <div className="portfolio__three-item" style={{ height: '100%' }}>
                  {data.logoUrl ? (
                    <img 
                      src={data.logoUrl} 
                      alt={data.name}
                      style={{
                        width: '100%',
                        height: '280px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        background: 'var(--bg-white)',
                        padding: '1rem'
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
                      Logo Yok
                    </div>
                  )}
                  <div className="portfolio__three-item-content">
                    <Link href={`/temsilcilikler/${data.slug}`}>
                      <i className="flaticon flaticon-right-up"></i>
                    </Link>
                    <span>Temsilcilik</span>
                    <h4>
                      <Link href={`/temsilcilikler/${data.slug}`}>{data.name}</Link>
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
                <p style={{ fontSize: '1.2rem', color: 'var(--body-color)' }}>Henüz temsilcilik eklenmemiş.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RepresentativesMain

