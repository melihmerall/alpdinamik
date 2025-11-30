"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import BlogDetails from "@/components/pages/blogs/blog-details"

const BlogDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${slug}`)
        if (response.ok) {
          const data = await response.json()
          const postData = data.data || data
          setPost(postData)
        } else {
          router.push("/404-error")
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        router.push("/404-error")
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchPost()
    }
  }, [slug, router])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!post) {
    return null
  }

  // Transform API data to component format
  const singleData = {
    id: post.slug,
    title: post.title,
    image: {
      src: post.imageUrl || '/assets/img/blog/blog-1.jpg'
    },
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : '',
    comment: 0,
    body: post.body,
    summary: post.summary,
    breadcrumbImageUrl: post.breadcrumbImageUrl,
  }

  return (
    <>
      <BlogDetails singleData={singleData} />
    </>
  )
}

export default BlogDetailPage

