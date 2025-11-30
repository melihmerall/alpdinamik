"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"

const ServicesMain = () => {
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          setServicesData(data.data || data)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="services__page section-padding-three">
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
    <>
      <div className="services__page section-padding-three">
        <div className="container">
          <div className="row">
            {servicesData?.map((data, id) => (
              <div className="col-lg-4 col-md-6 mt-25" key={id}>
                <div className="services__one-item">
                  {data.icon && <i className={data.icon}></i>}
                  <h4><Link href={`/services/${data.slug}`}>{data.title}</Link></h4>
                  <Link className="more_btn" href={`/services/${data.slug}`}>Detaylar<i className="flaticon-right-up"></i></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ServicesMain
