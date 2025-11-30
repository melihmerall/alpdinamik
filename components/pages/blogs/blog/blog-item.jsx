"use client"
import Link from 'next/link'
import React from 'react'

const BlogItem = ({ currentBlogItems }) => {
  return (
    <>
      {currentBlogItems?.map((data, id) => (
        <div className="col-lg-6 mt-25" key={id}>
          <div className="blog__three-item mt-25">
            <div className="blog__three-item-image">
              <Link href={`/blog/${data.slug}`}>
                <img 
                  src={data.imageUrl || data.image?.src || '/assets/img/blog/blog-1.jpg'} 
                  alt={data.title || 'image'} 
                />
              </Link>
            </div>
            <div className="blog__three-item-content">
              <div className="meta">
                <ul>
                  <li><Link href="#"><i className="far fa-user"></i>By-Admin</Link></li>
                  <li><Link href="#"><i className="far fa-comment-dots"></i>Comments (0)</Link></li>
                </ul>
              </div>
              <h4><Link href={`/blog/${data.slug}`}>{data.title}</Link></h4>
              <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                {data.summary?.substring(0, 100)}...
              </p>
              <Link className="more_btn" href={`/blog/${data.slug}`}>
                Daha Fazla Oku<i className="flaticon-right-up"></i>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default BlogItem
