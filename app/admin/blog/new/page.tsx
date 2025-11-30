"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    body: '',
    imageUrl: '',
    breadcrumbImageUrl: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
    isPublished: false,
    publishedAt: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'blog')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          imageUrl: data.url,
        }))
      } else {
        setError(data.error || 'Dosya yüklenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Dosya yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.isPublished && formData.publishedAt ? formData.publishedAt : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/blog')
        router.refresh()
      } else {
        setError(data.error || 'Blog yazısı oluşturulurken bir hata oluştu')
      }
    } catch (err) {
      setError('Sunucuya bağlanırken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link href="/admin/blog" className="admin-btn admin-btn-secondary admin-btn-sm">
            ← Geri
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-gray-900)', margin: 0 }}>
            Yeni Blog Yazısı
          </h1>
        </div>
      </div>

      <div className="admin-card">
        {error && (
          <div style={{
            padding: '1rem',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Başlık *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Özet *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                İçerik *
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                rows={10}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  Görsel
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                {uploading && (
                  <p style={{ marginTop: '0.5rem', color: 'var(--admin-gray-600)', fontSize: '0.875rem' }}>
                    Yükleniyor...
                  </p>
                )}
                {formData.imageUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', border: '1px solid var(--admin-gray-300)' }}
                    />
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Veya URL girin"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--admin-gray-300)',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                )}
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                  Maksimum 5MB, JPG, PNG, GIF, WebP
                </small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  Yayın Tarihi
                </label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  Yayınla
                </span>
              </label>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--admin-gray-200)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--admin-gray-900)', marginBottom: '1.5rem' }}>
                SEO Ayarları
              </h3>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    SEO Başlık (Meta Title)
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    placeholder="Boş bırakılırsa sayfa başlığı kullanılır"
                    maxLength={60}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Önerilen: 50-60 karakter. Arama motorlarında görünecek başlık.
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    SEO Açıklama (Meta Description)
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Boş bırakılırsa özet kullanılır"
                    maxLength={160}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Önerilen: 150-160 karakter. Arama sonuçlarında görünecek açıklama.
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    SEO Anahtar Kelimeler (Meta Keywords)
                  </label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                    placeholder="virgülle ayrılmış anahtar kelimeler (örn: lineer hareket, vidalı kriko, mühendislik)"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Virgülle ayrılmış anahtar kelimeler (örn: lineer hareket, vidalı kriko, mühendislik)
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    Open Graph Görseli (Sosyal Medya Paylaşım Görseli)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploading(true)
                      const uploadFormData = new FormData()
                      uploadFormData.append('file', file)
                      uploadFormData.append('folder', 'og-images')
                      fetch('/api/upload', {
                        method: 'POST',
                        body: uploadFormData,
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.url) {
                            setFormData(prev => ({ ...prev, ogImage: data.url }))
                          }
                        })
                        .finally(() => setUploading(false))
                    }}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  {uploading && (
                    <p style={{ marginTop: '0.5rem', color: 'var(--admin-gray-600)', fontSize: '0.875rem' }}>
                      Yükleniyor...
                    </p>
                  )}
                  {formData.ogImage && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={formData.ogImage} 
                        alt="OG Preview" 
                        style={{ maxWidth: '200px', maxHeight: '100px', borderRadius: '4px', border: '1px solid var(--admin-gray-300)' }}
                      />
                      <input
                        type="text"
                        name="ogImage"
                        value={formData.ogImage}
                        onChange={handleChange}
                        placeholder="Veya URL girin"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid var(--admin-gray-300)',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          marginTop: '0.5rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  )}
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Facebook, Twitter, LinkedIn gibi platformlarda paylaşımda görünecek görsel (Önerilen: 1200x630px)
                  </small>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn-primary"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <Link href="/admin/blog" className="admin-btn admin-btn-secondary">
                İptal
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

