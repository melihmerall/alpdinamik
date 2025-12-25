"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditBannerPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    videoUrl: '',
    ctaLabel: '',
    ctaUrl: '',
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/banners/${id}`)
        const data = await response.json()

        if (response.ok) {
          setFormData({
            title: data.title || '',
            subtitle: data.subtitle || '',
            imageUrl: data.imageUrl || '',
            videoUrl: data.videoUrl || '',
            ctaLabel: data.ctaLabel || '',
            ctaUrl: data.ctaUrl || '',
            isActive: data.isActive !== undefined ? data.isActive : true,
            order: data.order || 0,
          })
        } else {
          setError('Banner bulunamadı')
        }
      } catch (err) {
        setError('Banner yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBanner()
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
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
      uploadFormData.append('folder', 'banners')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/banners')
      } else {
        setError(data.error || 'Banner güncellenirken bir hata oluştu')
        setSaving(false)
      }
    } catch (err) {
      setError('Banner güncellenirken bir hata oluştu')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--admin-gray-900)', 
            margin: '0 0 0.5rem' 
          }}>
            Banner Düzenle
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Banner bilgilerini güncelleyin
          </p>
        </div>
        <Link
          href="/admin/banners"
          className="admin-btn admin-btn-secondary"
        >
          Geri Dön
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Başlık
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Alt Başlık
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Video URL (Opsiyonel)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://html.nextwpcook.com/buildgo/assets/img/banner/banner.mp4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  marginBottom: '1.5rem'
                }}
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--admin-gray-600)', 
                marginTop: '0.5rem',
                marginBottom: '1rem'
              }}>
                Video URL girilirse, anasayfa her yüklendiğinde video 1 kez oynatılır. Video bitince ekli olan görsel gösterilmeye devam eder. Hem video hem görsel eklemeniz önerilir.
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Banner Görseli <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {formData.imageUrl && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }} 
                  />
                </div>
              )}
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
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              {uploading && (
                <p style={{ marginTop: '0.5rem', color: 'var(--admin-gray-600)' }}>
                  Yükleniyor...
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'var(--admin-gray-900)'
                }}>
                  CTA Etiketi
                </label>
                <input
                  type="text"
                  name="ctaLabel"
                  value={formData.ctaLabel}
                  onChange={handleChange}
                  placeholder="Örn: Daha Fazlasını Keşfedin"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'var(--admin-gray-900)'
                }}>
                  CTA URL
                </label>
                <input
                  type="text"
                  name="ctaUrl"
                  value={formData.ctaUrl}
                  onChange={handleChange}
                  placeholder="/hakkimizda"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'var(--admin-gray-900)'
                }}>
                  Sıra
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.75rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontWeight: '500', color: 'var(--admin-gray-900)' }}>
                    Aktif
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--admin-gray-200)'
          }}>
            <button
              type="submit"
              disabled={saving || uploading}
              className="admin-btn admin-btn-primary"
              style={{ opacity: saving || uploading ? 0.6 : 1 }}
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            <Link
              href="/admin/banners"
              className="admin-btn admin-btn-secondary"
            >
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

