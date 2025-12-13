"use client"
import Link from 'next/link'
import React from 'react'

const BlogItem = ({ currentBlogItems }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      {currentBlogItems?.map((data, id) => (
        <div className="col-lg-6" key={id} style={{ marginBottom: '2.5rem', paddingLeft: '15px', paddingRight: '15px' }}>
          <div className="blog__three-item" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="blog__three-item-image" style={{ overflow: 'hidden', borderRadius: '8px' }}>
              <Link href={`/blog/${data.slug}`}>
                <img 
                  src={data.imageUrl || data.image?.src || '/assets/img/blog/blog-1.jpg'} 
                  alt={data.title || 'image'}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </Link>
            </div>
            <div className="blog__three-item-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '1.5rem' }}>
              {data.publishedAt && (
                <div className="meta" style={{ marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--body-color)', fontSize: '0.875rem' }}>
                    <i className="far fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
                    {formatDate(data.publishedAt)}
                  </span>
                </div>
              )}
              <h4 style={{ marginBottom: '1rem' }}>
                <Link href={`/blog/${data.slug}`} style={{ color: 'var(--text-heading-color)' }}>
                  {data.title}
                </Link>
              </h4>
              {data.summary && (
                <p style={{ 
                  marginBottom: '1.5rem', 
                  color: 'var(--body-color)', 
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  flex: 1
                }}>
                  {data.summary.length > 120 ? `${data.summary.substring(0, 120)}...` : data.summary}
                </p>
              )}
              <Link 
                className="more_btn" 
                href={`/blog/${data.slug}`}
                style={{ marginTop: 'auto' }}
              >
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
