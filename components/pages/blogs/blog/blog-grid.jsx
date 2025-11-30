"use client"
import React, { useState, useEffect } from 'react'
import BlogItem from './blog-item'
import Pagination from './pagination'

const BlogGridMain = ({ position }) => {
  const blogItemShow = 4
  const [currentPage, setCurrentPage] = useState(0)
  const [blogData, setBlogData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch('/api/blog?published=true')
        if (response.ok) {
          const result = await response.json()
          const posts = result.data || result
          setBlogData(posts)
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogPosts()
  }, [])

  if (loading) {
    return (
      <div className="two__columns section-padding-three">
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

  const totalPages = Math.ceil(blogData.length / blogItemShow)
  const startIndex = currentPage * blogItemShow
  const endIndex = startIndex + blogItemShow
  const currentBlogItems = blogData.slice(startIndex, endIndex)

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <>
      <div className="two__columns section-padding-three">
        <div className="container">
          <div className="row">
            <BlogItem currentBlogItems={currentBlogItems} />
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              handlePrevPage={handlePrevPage}
              totalPages={totalPages}
              handleNextPage={handleNextPage}
              setCurrentPage={setCurrentPage}
              position={position || "center"}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default BlogGridMain
