"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

const BlogSidebar = () => {
    const [recentBlogs, setRecentBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecentBlogs() {
            try {
                const response = await fetch('/api/blog?published=true&limit=3')
                if (response.ok) {
                    const result = await response.json()
                    const posts = result.data || result
                    setRecentBlogs(posts)
                }
            } catch (error) {
                console.error('Error fetching recent blogs:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchRecentBlogs()
    }, [])

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="all__sidebar">
            <div className="all__sidebar-item">
                <h4>Son Yazılar</h4>
                <div className="all__sidebar-item-post">
                    {loading ? (
                        <p style={{ color: 'var(--body-color)' }}>Yükleniyor...</p>
                    ) : recentBlogs.length > 0 ? (
                        recentBlogs.map((data) => (
                            <div className="post__item" key={data.id || data.slug}>
                                <div className="post__item-image">
                                    <Link href={`/blog/${data.slug}`}>
                                        <img 
                                            src={data.imageUrl || data.image?.src || '/assets/img/blog/blog-1.jpg'} 
                                            alt={data.title || 'image'}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </Link>
                                </div>
                                <div className="post__item-title">
                                    <span style={{ color: 'var(--body-color)', fontSize: '0.875rem' }}>
                                        <i className="far fa-calendar-alt" style={{ marginRight: '0.25rem' }}></i>
                                        {formatDate(data.publishedAt || data.createdAt)}
                                    </span>
                                    <h6>
                                        <Link 
                                            href={`/blog/${data.slug}`}
                                            style={{ color: 'var(--text-heading-color)' }}
                                        >
                                            {data.title}
                                        </Link>
                                    </h6>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--body-color)' }}>Henüz blog yazısı yok.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;