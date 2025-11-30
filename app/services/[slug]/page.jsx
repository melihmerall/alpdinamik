"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ServicesSingle from '@/components/pages/services/service-single'

const ServiceDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch(`/api/services/${slug}`)
        if (response.ok) {
          const data = await response.json()
          const serviceData = data.data || data
          setService(serviceData)
        } else {
          router.push("/404-error")
        }
      } catch (error) {
        console.error('Error fetching service:', error)
        router.push("/404-error")
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchService()
    }
  }, [slug, router])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!service) {
    return null
  }

  // Transform API data to component format
  const singleData = {
    id: service.slug,
    title: service.title,
    icon: service.icon,
    summary: service.summary,
    body: service.body,
    imageUrl: service.imageUrl,
    breadcrumbImageUrl: service.breadcrumbImageUrl,
  }

  return (
    <>
      <ServicesSingle singleData={singleData} />
    </>
  )
}

export default ServiceDetailPage

