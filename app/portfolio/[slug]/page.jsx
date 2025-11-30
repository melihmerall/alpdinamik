"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import PortfolioDetails from "@/components/pages/portfolio/portfolio-details"

const PortfolioDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/portfolio/${slug}`)
        if (response.ok) {
          const data = await response.json()
          const projectData = data.data || data
          setProject(projectData)
        } else {
          router.push("/404-error")
        }
      } catch (error) {
        console.error('Error fetching portfolio project:', error)
        router.push("/404-error")
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchProject()
    }
  }, [slug, router])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!project) {
    return null
  }

  // Transform API data to component format
  const singleData = {
    id: project.slug,
    title: project.title,
    image: {
      src: project.imageUrl || '/assets/img/portfolio/portfolio-1.jpg'
    },
    category: project.sector?.name || project.summary,
    date: project.year?.toString() || '',
    body: project.body,
    summary: project.summary,
    breadcrumbImageUrl: project.breadcrumbImageUrl,
  }

  return (
    <>
      <PortfolioDetails singleData={singleData} />
    </>
  )
}

export default PortfolioDetailPage

